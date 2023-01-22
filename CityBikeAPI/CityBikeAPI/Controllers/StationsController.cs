using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CityBikeAPI.Data;
using CityBikeAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CityBikeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StationsController : Controller
    {
        private readonly ICityBikeRepository _repository;
        private readonly ILogger _logger;

        public StationsController(ICityBikeRepository repository, ILogger<StationsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Returns object with pagination info and array of stations by given parameters.
        /// </summary>
        /// <param name="name" example="kis">Optional: Station name or part of it.</param>
        /// <param name="address" example="mann">Optional: Station address or part of it.</param>
        /// <param name="city" example="hel">Optional: City name or part of it.</param>
        /// <param name="sortBy" example="address">Optional: Column name on which the sorting will be applied. Defaults to name.</param>
        /// <param name="sortDir" example="asc">Optional: Sorting direction, "asc" or "desc". Defaults to asc.</param>
        /// <param name="rowsPerPage" example="100">Required: Rows per page</param>
        /// <param name="page" example="0">Required: Zero based page number.</param>
        /// <param name="clientLanguage" example="fin">Required: Allowed values are "fin", "swe" and "eng".</param>
        /// <response code="200">PaginatedStations-object with array of stations</response>
        /// <response code="404">PaginatedStations-object with empty array of stations</response>
        /// <response code="500">Unexpected error</response>
        [HttpGet()]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public IActionResult GetStationsList([FromQuery] string? name, [FromQuery] string? address, [FromQuery] string? city, [FromQuery] string? sortBy, [FromQuery] string? sortDir, [FromQuery] int rowsPerPage, [FromQuery] int page, [FromHeader] string clientLanguage)
        {
            if (rowsPerPage < 1 || rowsPerPage > 500 || page < 0)
            {
                return StatusCode(400, "Required query parameters are rowsPerPage (value between 1...500) and page (>= 0).");
            }

            try
            {
                PaginatedStations stations = _repository.GetStations(name, address, city, sortBy, sortDir, rowsPerPage, page, clientLanguage);
                if (stations.Stations.Count == 0)
                {
                    return StatusCode(404, stations);
                }
                return StatusCode(200, stations);
            }
            catch (Exception ex)
            {
                string timestamp = DateTime.Now.ToString("O");
                _logger.LogError($"{timestamp}, Exception message: {ex.Message}\n{timestamp}, StackTrace: {ex.StackTrace}\n{timestamp}, Arguments: [name: {name}, address: {address}, city: {city}, sortBy: {sortBy}, sortDir: {sortDir}, rowsPerPage: {rowsPerPage}, page: {page}, clientLanguage: {clientLanguage}].");
                return StatusCode(500, "Unexpected error happened.");
            }
        }


        /// <summary>
        /// Returns object of stations statistical details by station id.
        /// </summary>
        /// <param name="id">Station Id</param>
        /// <param name="statsFrom" example="2021-05-01">Optional: Starting date for statistics calculation.</param>
        /// <param name="statsTo" example="2021-06-01">Optional: End date for statistics calculation.</param>
        /// <response code="200">StationDetails-object</response>
        /// <response code="404">Empty StationDetails-object</response>
        /// <response code="500">Unexpected error</response>
        [HttpGet("{id}/details")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public IActionResult GetDetailsOfStation([FromRoute] int id, [FromQuery] DateTime? statsFrom, [FromQuery] DateTime? statsTo)
        {
            try
            {
                StationDetails details = _repository.GetStationDetails(id, statsFrom, statsTo);
                if (details.StationId <= 0)
                {
                    return StatusCode(404, details);
                }
                return StatusCode(200, details);
            }
            catch (Exception ex)
            {
                string timestamp = DateTime.Now.ToString("O");
                _logger.LogError($"{timestamp}, Exception message: {ex.Message}\n{timestamp}, StackTrace: {ex.StackTrace}\n{timestamp}, Arguments: [id: {id}, statsFrom: {statsFrom}, statsTo: {statsTo}].");
                return StatusCode(500, "Unexpected error happened.");
            }

        }
    }
}

