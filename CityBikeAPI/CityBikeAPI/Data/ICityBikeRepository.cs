using System;
using CityBikeAPI.Models;

namespace CityBikeAPI.Data
{
    public interface ICityBikeRepository
    {
        // List of stations
        PaginatedStations GetStations(string? name, string? address, string? city, string? sortBy, string? sortDir, int rowsPerPage, int page, string language);

        // Statistical details about selected station
        StationDetails GetStationDetails(int id, DateTime? statsFrom, DateTime? statsTo);

        // List of trips
        PaginatedTrips GetTrips(DateTime? departureDateFrom, DateTime? departureDateTo, string? departureStationName, string? returnStationName, string? sortBy, string? sortDir, int rowsPerPage, int page, string language);

        // Insert new trip to database
        int InsertNewTrip(NewTripIn trip);
    }
}

