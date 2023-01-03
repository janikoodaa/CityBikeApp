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
    public class StationsController : Controller
    {
        private readonly ICityBikeRepository _repository;
        private readonly ILogger _logger;

        public StationsController(ICityBikeRepository repository, ILogger<StationsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // api/stations lists all stations
        [HttpGet("stations")]
        public IActionResult GetStationsList([FromQuery] string? name, [FromQuery] string? address, [FromQuery] string? city, [FromQuery] string? sortBy, [FromQuery] string? sortDir, [FromQuery] int rowsPerPage, [FromQuery] int page, [FromQuery] string language)
        {
            if (rowsPerPage < 1 || page < 1 || language == null)
            {
                return StatusCode(400, "Required query parameters are rowsPerPage, page and language.");
            }

            List<Station> stations = new();

            try
            {
                stations = _repository.GetStations(name, address, city, sortBy, sortDir, rowsPerPage, page, language);
                if (stations.Count() == 0)
                {
                    return NotFound();
                }
                else return Ok(stations);
            }
            catch (Exception ex)
            {
                string timestamp = DateTime.Now.ToString("O");
                _logger.LogError($"{timestamp}, Exception message: {ex.Message}\n{timestamp}, StackTrace: {ex.StackTrace}\n{timestamp}, Arguments: [name: {name}, address: {address}, city: {city}, rowsPerPage: {rowsPerPage}, page: {page}, language: {language}].");
                return StatusCode(500);
            }
        }
    }
}

