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
        /// Returns object with pagination info and array of trips by given parameters.
        /// </summary>
        /// <param name="departureDateFrom" example="2021-06-01">Optional: Earliest departure date</param>
        /// <param name="departureDateTo" example="2021-06-04">Optional: Latest departure date</param>
        /// <param name="departureStationName" example="aalto">Optional: Departure station name or part of it</param>
        /// <param name="returnStationName" example="aalto">Optional: Return station name or part of it</param>
        /// <param name="sortBy" example="address">Optional: Column name on which the sorting will be applied. Defaults to name.</param>
        /// <param name="sortDir" example="asc">Optional: Sorting direction, "asc" or "desc". Defaults to asc.</param>
        /// <param name="rowsPerPage" example="100">Required: Rows per page</param>
        /// <param name="page" example="0">Required: Zero based page number.</param>
        /// <param name="clientLanguage" example="fin">Required: Allowed values are "fin", "swe" and "eng".</param>
        /// <response code="200">PaginatedTrips-object with array of trips</response>
        /// <response code="404">PaginatedTrips-object with empty array of trips</response>
        /// <response code="500">Unexpected error</response>
        [HttpGet()]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
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
        /// Creates a new trip to database.
        /// </summary>
        /// <remarks>
        /// Sample request body:
        /// {
        ///    "departureDate": "2023-01-20T12:00:00",
        ///    "returnDate": "2023-01-20T12:00:19",
        ///    "departureStationId": 3,
        ///    "returnStationId": 2,
        ///    "distanceMeters": 10,
        ///    "durationSeconds": 19
        /// }
        /// </remarks>
        /// <param name="trip">Mandatory trip properties in request body</param>
        /// <response code="201">Created trip id</response>
        /// <response code="400">Model validation or foreign key error</response>
        /// <response code="500">Unexpected error</response>
        [HttpPost()]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
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

