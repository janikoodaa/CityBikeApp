﻿using System;
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

        // api/stations lists all stations
        [HttpGet("list")]
        public IActionResult GetStationsList([FromQuery] string? name, [FromQuery] string? address, [FromQuery] string? city, [FromQuery] string? sortBy, [FromQuery] string? sortDir, [FromQuery] int rowsPerPage, [FromQuery] int page, [FromHeader] string clientLanguage)
        {
            if (rowsPerPage < 1 || rowsPerPage > 500 || page < 0)
            {
                return StatusCode(400, "Required query parameters are rowsPerPage (value between 1...500) and page (>= 0).");
            }

            PaginatedStations stations = new();

            try
            {
                stations = _repository.GetStations(name, address, city, sortBy, sortDir, rowsPerPage, page, clientLanguage);
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
                return StatusCode(500);
            }
        }

        [HttpGet("details/{id}")]
        public IActionResult GetDetailsOfStation([FromRoute] int id, [FromQuery] DateTime? statsFrom, [FromQuery] DateTime? statsTo)
        {
            StationDetails details = new();

            try
            {
                details = _repository.GetStationDetails(id, statsFrom, statsTo);
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
                return StatusCode(500);
            }

        }
    }
}

