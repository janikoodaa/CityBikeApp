using System;
using CityBikeAPI.Models;

namespace CityBikeAPI.Data
{
    public interface ICityBikeRepository
    {
        // List of stations
        List<Station> GetStations(string? name, string? address, string? city, string? sortBy, string? sortDir, int rowsPerPage, int page, string language);

        // List of trips
        List<Trip> GetTrips(DateTime? departureDateFrom, DateTime? departureDateTo, string? departureStationName, string? returnStationName, string? sortBy, string? sortDir, int rowsPerPage, int page, string language);
    }
}

