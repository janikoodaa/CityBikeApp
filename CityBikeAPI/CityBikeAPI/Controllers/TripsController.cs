using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CityBikeAPI.Data;
using CityBikeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CityBikeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : Controller
    {
        private readonly ICityBikeRepository _repository;
        private readonly ILogger _logger;

        public TripsController(ICityBikeRepository repository, ILogger<StationsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Get request to api/trips. stationName-queries depend on clientLanguage (fin, swe, eng) parameter, which should be included in request headers. If omitted, query is made using default language (fin).
        /// For pagination to work, rowsPerPage and page are mandatory params.
        /// Returns IActionResult with instance of PaginatedTrips-class, if no exception is caught.
        /// </summary>
        /// <param name="departureDateFrom"></param>
        /// <param name="departureDateTo"></param>
        /// <param name="departureStationName"></param>
        /// <param name="returnStationName"></param>
        /// <param name="sortBy"></param>
        /// <param name="sortDir"></param>
        /// <param name="rowsPerPage"></param>
        /// <param name="page"></param>
        /// <param name="clientLanguage"></param>
        /// <returns></returns>
        [HttpGet()]
        public IActionResult GetTripsList([FromQuery] DateTime? departureDateFrom, [FromQuery] DateTime? departureDateTo, [FromQuery] string? departureStationName, [FromQuery] string? returnStationName, [FromQuery] string? sortBy, [FromQuery] string? sortDir, [FromQuery] int rowsPerPage, [FromQuery] int page, [FromHeader] string clientLanguage)
        {
            if (rowsPerPage < 1 || rowsPerPage > 500 || page < 0)
            {
                return StatusCode(400, "Required query parameters are rowsPerPage (value between 1...500) and page (>= 0).");
            }

            PaginatedTrips trips = new();

            try
            {
                trips = _repository.GetTrips(departureDateFrom, departureDateTo, departureStationName, returnStationName, sortBy, sortDir, rowsPerPage, page, clientLanguage);
                if (trips.Trips.Count == 0)
                {
                    return StatusCode(404, trips);
                }
                else return StatusCode(200, trips);
            }
            catch (Exception ex)
            {
                string timestamp = DateTime.Now.ToString("O");
                _logger.LogError($"{timestamp}, Exception message: {ex.Message}\n{timestamp}, StackTrace: {ex.StackTrace}\n{timestamp}, Arguments: [departureDateFrom: {departureDateFrom}, departureDateTo: {departureDateTo}, departureStationName: {departureStationName}, returnStationName: {returnStationName}, sortBy: {sortBy}, sortDir: {sortDir}, rowsPerPage: {rowsPerPage}, page: {page}, clientLanguage: {clientLanguage}].");
                return StatusCode(500, "Unexpected error happened.");
            }
        }

        /// <summary>
        /// Post request to api/trips. Request body must contain NewTripIn-object, example below.
        /// {
        ///    "departureDate": "2023-01-20T12:00:00",
        ///    "returnDate": "2023-01-20T12:00:19",
        ///    "departureStationId": 3,
        ///    "returnStationId": 2,
        ///    "distanceMeters": 10,
        ///    "durationSeconds": 19
        /// }
        /// Return IActionResult with just created trip id, if no exception is caught.
        /// </summary>
        /// <param name="trip"></param>
        /// <returns></returns>
        [HttpPost()]
        public IActionResult PostNewTrip([FromBody] NewTripIn trip)
        {
            int newTripId;

            if (!ModelState.IsValid)
            {
                return StatusCode(400, trip);
            }

            try
            {
                newTripId = _repository.InsertNewTrip(trip);
                return StatusCode(201, newTripId);
            }
            catch (Exception ex)
            {

                string timestamp = DateTime.Now.ToString("O");
                _logger.LogError($"{timestamp}, Exception message: {ex.Message}\n{timestamp}, StackTrace: {ex.StackTrace}\n{timestamp}, Arguments: [trip: {JsonSerializer.Serialize(trip)}].");

                if (ex.Message.Contains("FK_Trips_ReturnStation"))
                {
                    return StatusCode(400, "Return station id doesn't exist.");
                }
                else if (ex.Message.Contains("FK_Trips_DepartureStation"))
                {
                    return StatusCode(400, "Departure station id doesn't exist.");
                }
                else
                {
                    return StatusCode(500, "Unexpected error happened.");
                }
            }


        }
    }
}

