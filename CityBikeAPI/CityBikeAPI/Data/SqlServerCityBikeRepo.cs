using System;
using System.Data;
using System.Runtime.ConstrainedExecution;
using Microsoft.Data.SqlClient;
using CityBikeAPI.Models;
using System.Configuration;
using System.Net;

namespace CityBikeAPI.Data
{
    public class SqlServerCityBikeRepo : ICityBikeRepository
    {
        private readonly IConfiguration _configuration;

        public SqlServerCityBikeRepo(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<Station> GetStations(string? name, string? address, string? city, string? sortBy, string? sortDir, int rowsPerPage, int page, string clientLanguage)
        {
            List<Station> stations = new();
            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = connection;
                        cmd.CommandType = System.Data.CommandType.Text;

                        // Build query string depending on the incoming parameteres
                        string query = @"select s.Id, s.NameFin, s.NameSwe, s.NameEng, s.AddressFin, s.AddressSwe, s.CityFin, s.CitySwe, s.Operator, s.Capacity, s.XCoordinate, s.YCoordinate "
                                       + " from citybike.stations_v s where 1 = 1 ";
                        // Search conditions
                        if (name != null)
                        {
                            if (clientLanguage.ToLower() == "fin") query += " and lower(s.NameFin) like @Name ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.NameSwe) like @Name ";
                            if (clientLanguage.ToLower() == "eng") query += " and lower(s.NameEng) like @Name ";
                            cmd.Parameters.Add("Name", SqlDbType.NVarChar).Value = $"%{name.ToLower()}%";
                        }
                        if (address != null)
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.AddressFin) like @Address ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.AddressSwe) like @Address ";
                            cmd.Parameters.Add("Address", SqlDbType.NVarChar).Value = $"%{address.ToLower()}%";
                        }
                        if (city != null)
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.CityFin) like @City ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.CitySwe) like @City ";
                            cmd.Parameters.Add("City", SqlDbType.NVarChar).Value = $"%{city.ToLower()}%";
                        }
                        // Order by
                        query += " order by ";
                        if (sortBy?.ToLower() == "address")
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " s.AddressFin ";
                            if (clientLanguage.ToLower() == "swe") query += " s.AddressSwe ";
                        }
                        else if (sortBy?.ToLower() == "city")
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " s.CityFin ";
                            if (clientLanguage.ToLower() == "swe") query += " s.CitySwe ";
                        }
                        else
                        {
                            if (clientLanguage.ToLower() == "fin") query += " s.NameFin ";
                            if (clientLanguage.ToLower() == "swe") query += " s.NameSwe ";
                            if (clientLanguage.ToLower() == "eng") query += " s.NameEng ";
                        }
                        // Order direction
                        if (sortDir?.ToLower() == "asc")
                        {
                            query += " asc ";
                        }
                        else
                        {
                            query += " desc ";
                        }
                        // Pagination
                        query += $" offset @Offset rows fetch next @RowsPerPage rows only ";
                        cmd.Parameters.Add("Offset", SqlDbType.Int).Value = (page - 1) * rowsPerPage;
                        cmd.Parameters.Add("RowsPerPage", SqlDbType.Int).Value = rowsPerPage;
                        // Assign complete query string to CommandText
                        cmd.CommandText = query;

                        connection.Open();
                        SqlDataReader reader = cmd.ExecuteReader();

                        while (reader.Read())
                        {
                            stations.Add(new Station(
                                reader.GetInt32(reader.GetOrdinal("Id")),
                                reader.GetString(reader.GetOrdinal("NameFin")),
                                reader.GetString(reader.GetOrdinal("NameSwe")),
                                reader.GetString(reader.GetOrdinal("NameEng")),
                                reader.GetString(reader.GetOrdinal("AddressFin")),
                                reader.GetString(reader.GetOrdinal("AddressSwe")),
                                reader.GetString(reader.GetOrdinal("CityFin")),
                                reader.GetString(reader.GetOrdinal("CitySwe")),
                                reader.GetString(reader.GetOrdinal("Operator")),
                                reader.GetInt32(reader.GetOrdinal("Capacity")),
                                reader.GetDecimal(reader.GetOrdinal("XCoordinate")),
                                reader.GetDecimal(reader.GetOrdinal("YCoordinate"))
                                ));
                        }
                        reader.Close();
                        connection.Close();
                    }
                }
                return stations;
            }
            catch
            {
                throw;
            }
        }

        public List<Trip> GetTrips(DateTime? departureDateFrom, DateTime? departureDateTo, string? departureStationName, string? returnStationName, string? sortBy, string? sortDir, int rowsPerPage, int page, string clientLanguage)
        {
            List<Trip> trips = new();
            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = connection;
                        cmd.CommandType = System.Data.CommandType.Text;

                        // Build query string depending on the incoming parameteres
                        string query = @"select t.Id, t.DepartureDate, t.DepartureStationId, t.DepartureStationNameFin, t.DepartureStationNameSwe, t.DepartureStationNameEng, t.DepartureStationAddressFin, t.DepartureStationAddressSwe, "
                                       + " t.DepartureStationCityFin, t.DepartureStationCitySwe, t.DepartureStationOperator, t.DepartureStationCapacity, t.DepartureStationXCoordinate, t.DepartureStationYCoordinate, t.ReturnDate, "
                                       + " t.ReturnStationId, t.ReturnStationNameFin, t.ReturnStationNameSwe, t.ReturnStationNameEng, t.ReturnStationAddressFin, t.ReturnStationAddressSwe, t.ReturnStationCityFin, t.ReturnStationCitySwe, "
                                       + " t.ReturnStationOperator, t.ReturnStationCapacity, t.ReturnStationXCoordinate, t.ReturnStationYCoordinate, t.CoveredDistanceInMeters, t.DurationInSeconds "
                                       + " from citybike.Trips_v t where 1 = 1 ";
                        // Search conditions
                        if (departureDateFrom != null)
                        {
                            query += " and t.DepartureDate >= @DepartureDateFrom ";
                            cmd.Parameters.Add("DepartureDateFrom", SqlDbType.DateTime).Value = departureDateFrom;
                        }
                        if (departureDateTo != null)
                        {
                            query += " and t.DepartureDate <= @DepartureDateTo ";
                            cmd.Parameters.Add("DepartureDateTo", SqlDbType.DateTime).Value = departureDateTo;
                        }
                        if (departureStationName != null)
                        {
                            switch (clientLanguage.ToLower())
                            {
                                case "swe":
                                    query += " and lower(t.DepartureStationNameSwe) like @DepartureStationName ";
                                    break;
                                case "eng":
                                    query += " and lower(t.DepartureStationNameEng) like @DepartureStationName ";
                                    break;
                                default:
                                    query += " and lower(t.DepartureStationNameFin) like @DepartureStationName ";
                                    break;
                            }
                            cmd.Parameters.Add("DepartureStationName", SqlDbType.NVarChar).Value = $"%{departureStationName.ToLower()}%";
                        }
                        if (returnStationName != null)
                        {
                            switch (clientLanguage.ToLower())
                            {
                                case "swe":
                                    query += " and lower(t.ReturnStationNameSwe) like @ReturnStationName ";
                                    break;
                                case "eng":
                                    query += " and lower(t.ReturnStationNameEng) like @ReturnStationName ";
                                    break;
                                default:
                                    query += " and lower(t.ReturnStationNameFin) like @ReturnStationName ";
                                    break;
                            }
                            cmd.Parameters.Add("ReturnStationName", SqlDbType.NVarChar).Value = $"%{returnStationName.ToLower()}%";
                        }
                        // Order by
                        switch (sortBy?.ToLower())
                        {
                            case "departurestationname":
                                switch (clientLanguage.ToLower())
                                {
                                    case "swe":
                                        query += " order by t.DepartureStationNameSwe ";
                                        break;
                                    case "eng":
                                        query += " order by t.DepartureStationNameEng ";
                                        break;
                                    default:
                                        query += " order by t.DepartureStationNameFin ";
                                        break;
                                }
                                break;
                            case "returnstationname":
                                switch (clientLanguage.ToLower())
                                {
                                    case "swe":
                                        query += " order by t.ReturnStationNameSwe ";
                                        break;
                                    case "eng":
                                        query += " order by t.ReturnStationNameEng ";
                                        break;
                                    default:
                                        query += " order by t.ReturnStationNameFin ";
                                        break;
                                }
                                break;
                            case "distance":
                                query += " order by t.DistanceInMeters ";
                                break;
                            case "duration":
                                query += " order by t.DurationInSeconds ";
                                break;
                            default:
                                query += " order by t.DepartureDate ";
                                break;
                        }
                        // Order direction
                        if (sortDir?.ToLower() == "asc")
                        {
                            query += " asc ";
                        }
                        else
                        {
                            query += " desc ";
                        }
                        // Pagination
                        query += $" offset @Offset rows fetch next @RowsPerPage rows only ";
                        cmd.Parameters.Add("Offset", SqlDbType.Int).Value = (page - 1) * rowsPerPage;
                        cmd.Parameters.Add("RowsPerPage", SqlDbType.Int).Value = rowsPerPage;
                        // Assign complete query string to CommandText
                        cmd.CommandText = query;

                        connection.Open();
                        SqlDataReader reader = cmd.ExecuteReader();

                        while (reader.Read())
                        {
                            trips.Add(new Trip(
                                reader.GetInt32(reader.GetOrdinal("Id")),
                                reader.GetDateTime(reader.GetOrdinal("DepartureDate")),
                                reader.GetDateTime(reader.GetOrdinal("ReturnDate")),
                                new Station(
                                    reader.GetInt32(reader.GetOrdinal("DepartureStationId")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationNameFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationNameSwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationNameEng")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationAddressFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationAddressSwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationCityFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationCitySwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationOperator")),
                                    reader.GetInt32(reader.GetOrdinal("DepartureStationCapacity")),
                                    reader.GetDecimal(reader.GetOrdinal("DepartureStationXCoordinate")),
                                    reader.GetDecimal(reader.GetOrdinal("DepartureStationYCoordinate"))
                                    ),
                                new Station(
                                    reader.GetInt32(reader.GetOrdinal("ReturnStationId")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationNameFin")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationNameSwe")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationNameEng")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationAddressFin")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationAddressSwe")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationCityFin")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationCitySwe")),
                                    reader.GetString(reader.GetOrdinal("ReturnStationOperator")),
                                    reader.GetInt32(reader.GetOrdinal("ReturnStationCapacity")),
                                    reader.GetDecimal(reader.GetOrdinal("ReturnStationXCoordinate")),
                                    reader.GetDecimal(reader.GetOrdinal("ReturnStationYCoordinate"))
                                    ),
                                reader.GetInt32(reader.GetOrdinal("CoveredDistanceInMeters")),
                                reader.GetInt32(reader.GetOrdinal("DurationInSeconds"))
                                ));
                        }
                        reader.Close();
                        connection.Close();
                    }
                }
                return trips;
            }
            catch
            {
                throw;
            }
        }

    }
}
