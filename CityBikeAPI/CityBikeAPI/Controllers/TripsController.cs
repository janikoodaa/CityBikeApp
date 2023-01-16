using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CityBikeAPI.Data;
using CityBikeAPI.Models;
using Microsoft.AspNetCore.Mvc;

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

        // api/trips lists all trips
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
                return StatusCode(500);
            }
        }
    }
}

