using System;
using System.Data;
using System.Runtime.ConstrainedExecution;
using Microsoft.Data.SqlClient;
using CityBikeAPI.Models;
using System.Configuration;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Globalization;
using System.Collections.Generic;

namespace CityBikeAPI.Data
{
    public class SqlServerCityBikeRepo : ICityBikeRepository
    {
        private readonly IConfiguration _configuration;

        public SqlServerCityBikeRepo(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public PaginatedStations GetStations(string? name, string? address, string? city, string? sortBy, string? sortDir, int rowsPerPage, int page, string clientLanguage)
        {
            PaginatedStations data = new();
            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd1 = new SqlCommand())
                    {
                        cmd1.Connection = connection;
                        cmd1.CommandType = System.Data.CommandType.Text;

                        // Build query string depending on the incoming parameteres
                        string query = @"select count(1) from citybike.stations_v s where 1 = 1 ";
                        if (name != null)
                        {
                            if (clientLanguage.ToLower() == "fin") query += " and lower(s.NameFin) like @Name ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.NameSwe) like @Name ";
                            if (clientLanguage.ToLower() == "eng") query += " and lower(s.NameEng) like @Name ";
                            cmd1.Parameters.Add("Name", SqlDbType.NVarChar).Value = $"%{name.ToLower()}%";
                        }
                        if (address != null)
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.AddressFin) like @Address ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.AddressSwe) like @Address ";
                            cmd1.Parameters.Add("Address", SqlDbType.NVarChar).Value = $"%{address.ToLower()}%";
                        }
                        if (city != null)
                        {
                            if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.CityFin) like @City ";
                            if (clientLanguage.ToLower() == "swe") query += " and lower(s.CitySwe) like @City ";
                            cmd1.Parameters.Add("City", SqlDbType.NVarChar).Value = $"%{city.ToLower()}%";
                        }
                        // Assign complete query string to CommandText
                        cmd1.CommandText = query;

                        connection.Open();
                        SqlDataReader reader = cmd1.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                data.TotalRowCount = reader.GetInt32(0);
                            }
                        }
                        reader.Close();
                        connection.Close();
                    }
                    if (data.TotalRowCount > 0)
                    {
                        using (SqlCommand cmd2 = new SqlCommand())
                        {
                            cmd2.Connection = connection;
                            cmd2.CommandType = System.Data.CommandType.Text;

                            // Build query string depending on the incoming parameteres
                            string query = @"select s.Id, s.NameFin, s.NameSwe, s.NameEng, s.AddressFin, s.AddressSwe, s.CityFin, s.CitySwe, s.Operator, s.Capacity, s.XCoordinate, s.YCoordinate "
                                           + " from citybike.stations_v s where 1 = 1 ";
                            // Search conditions
                            if (name != null)
                            {
                                if (clientLanguage.ToLower() == "fin") query += " and lower(s.NameFin) like @Name ";
                                if (clientLanguage.ToLower() == "swe") query += " and lower(s.NameSwe) like @Name ";
                                if (clientLanguage.ToLower() == "eng") query += " and lower(s.NameEng) like @Name ";
                                cmd2.Parameters.Add("Name", SqlDbType.NVarChar).Value = $"%{name.ToLower()}%";
                            }
                            if (address != null)
                            {
                                if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.AddressFin) like @Address ";
                                if (clientLanguage.ToLower() == "swe") query += " and lower(s.AddressSwe) like @Address ";
                                cmd2.Parameters.Add("Address", SqlDbType.NVarChar).Value = $"%{address.ToLower()}%";
                            }
                            if (city != null)
                            {
                                if (clientLanguage.ToLower() == "fin" || clientLanguage.ToLower() == "eng") query += " and lower(s.CityFin) like @City ";
                                if (clientLanguage.ToLower() == "swe") query += " and lower(s.CitySwe) like @City ";
                                cmd2.Parameters.Add("City", SqlDbType.NVarChar).Value = $"%{city.ToLower()}%";
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
                            else if (sortBy?.ToLower() == "capacity")
                            {
                                query += " s.Capacity ";
                            }
                            else
                            {
                                if (clientLanguage.ToLower() == "fin") query += " s.NameFin ";
                                if (clientLanguage.ToLower() == "swe") query += " s.NameSwe ";
                                if (clientLanguage.ToLower() == "eng") query += " s.NameEng ";
                            }
                            // Order direction
                            if (sortDir?.ToLower() == "desc")
                            {
                                query += " desc ";
                            }
                            else
                            {
                                query += " asc ";
                            }
                            // Pagination
                            query += $" offset @Offset rows fetch next @RowsPerPage rows only ";
                            cmd2.Parameters.Add("Offset", SqlDbType.Int).Value = page * rowsPerPage;
                            cmd2.Parameters.Add("RowsPerPage", SqlDbType.Int).Value = rowsPerPage;
                            // Assign complete query string to CommandText
                            cmd2.CommandText = query;

                            connection.Open();
                            SqlDataReader reader = cmd2.ExecuteReader();

                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    data.Stations.Add(new Station(
                                        reader.GetInt32(reader.GetOrdinal("Id")),
                                        new Translations(reader.GetString(reader.GetOrdinal("NameFin")),
                                        reader.GetString(reader.GetOrdinal("NameSwe")),
                                        reader.GetString(reader.GetOrdinal("NameEng"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("AddressFin")),
                                        reader.GetString(reader.GetOrdinal("AddressSwe")),
                                        reader.GetString(reader.GetOrdinal("AddressFin"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("CityFin")),
                                        reader.GetString(reader.GetOrdinal("CitySwe")),
                                        reader.GetString(reader.GetOrdinal("CityFin"))),
                                        reader.GetString(reader.GetOrdinal("Operator")),
                                        reader.GetInt32(reader.GetOrdinal("Capacity")),
                                        reader.GetDecimal(reader.GetOrdinal("XCoordinate")),
                                        reader.GetDecimal(reader.GetOrdinal("YCoordinate"))
                                        ));
                                }
                                data.RowsFrom = page * rowsPerPage + 1;
                                data.RowsTo = page * rowsPerPage + data.Stations.Count;
                            }
                            reader.Close();
                            connection.Close();
                        }
                    }
                }

                return data;
            }
            catch
            {
                throw;
            }
        }

        public StationDetails GetStationDetails(int id, DateTime? statsFrom, DateTime? statsTo)
        {
            StationDetails details = new();
            DateTime statsToEnd = new DateTime();
            if (statsTo != null)
            {
                statsToEnd = statsTo!.Value.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd1 = new SqlCommand())
                    {
                        cmd1.Connection = connection;
                        cmd1.CommandType = System.Data.CommandType.Text;
                        cmd1.Parameters.Add("Id", SqlDbType.Int).Value = id;

                        string departureDateFromCondition = "";
                        string departureDateToCondition = "";

                        if (statsFrom != null)
                        {
                            departureDateFromCondition = " and t.DepartureDate >= @StatsFrom ";
                            cmd1.Parameters.Add("StatsFrom", SqlDbType.DateTime).Value = statsFrom;
                        }

                        if (statsTo != null)
                        {
                            departureDateToCondition = " and t.DepartureDate < @StatsTo ";
                            cmd1.Parameters.Add("StatsTo", SqlDbType.DateTime).Value = statsTo;
                        }

                        string query1 = $"select s.Id, (select count(1) from citybike.Trips_v t where t.DepartureStationId = @Id "
                                        + $" {departureDateFromCondition} {departureDateToCondition} ) TripsStartingFrom, "
                                        + " (select count(1) from citybike.Trips_v t where t.ReturnStationId = @Id "
                                        + $" {departureDateFromCondition} {departureDateToCondition} ) TripsEndingTo, "
                                        + " (select AVG(t.CoveredDistanceInMeters) from citybike.Trips_v t where t.DepartureStationId = @Id "
                                        + $" {departureDateFromCondition} {departureDateToCondition} ) AvgDistanceStartingFrom, "
                                        + " (select AVG(t.CoveredDistanceInMeters) from citybike.Trips_v t where t.ReturnStationId = @Id "
                                        + $" {departureDateFromCondition} {departureDateToCondition} ) AvgDistanceEndingTo "
                                        + " from citybike.Stations_v s "
                                        + " where s.Id = @Id ";

                        cmd1.CommandText = query1;

                        connection.Open();
                        SqlDataReader reader = cmd1.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                details.StationId = reader.GetInt32(reader.GetOrdinal("Id"));
                                details.TripsCountFromStation = reader.GetInt32(reader.GetOrdinal("TripsStartingFrom"));
                                details.TripsCountToStation = reader.GetInt32(reader.GetOrdinal("TripsEndingTo"));
                                details.AverageDistanceFromStation = reader.IsDBNull(reader.GetOrdinal("AvgDistanceStartingFrom")) ? 0 : reader.GetInt32(reader.GetOrdinal("AvgDistanceStartingFrom"));
                                details.AverageDistanceToStation = reader.IsDBNull(reader.GetOrdinal("AvgDistanceEndingTo")) ? 0 : reader.GetInt32(reader.GetOrdinal("AvgDistanceEndingTo"));
                            }
                        }
                        reader.Close();

                        string query2 = @"select top 5 count(t.ReturnStationId) CountTripsStartingFrom, t.ReturnStationId, t.ReturnStationNameFin, "
                                           + " t.ReturnStationNameSwe, t.ReturnStationNameEng, t.ReturnStationAddressFin, t.ReturnStationAddressSwe, t.ReturnStationCityFin, t.ReturnStationCitySwe, "
                                           + " t.ReturnStationOperator, t.ReturnStationCapacity, t.ReturnStationXCoordinate, t.ReturnStationYCoordinate "
                                           + $" from citybike.Trips_v t where t.DepartureStationId = @Id {departureDateFromCondition} {departureDateToCondition} "
                                           + " GROUP by t.ReturnStationId, t.ReturnStationNameFin, t.ReturnStationNameSwe, t.ReturnStationNameEng, t.ReturnStationAddressFin, "
                                           + " t.ReturnStationAddressSwe, t.ReturnStationCityFin, t.ReturnStationCitySwe, t.ReturnStationOperator, t.ReturnStationCapacity, t.ReturnStationXCoordinate, t.ReturnStationYCoordinate order by 1 desc ";

                        cmd1.CommandText = query2;

                        reader = cmd1.ExecuteReader();

                        if (reader.HasRows)
                        {
                            List<DetailedStation> destinations = new();
                            while (reader.Read())
                            {
                                destinations.Add(new DetailedStation(
                                    reader.GetInt32(reader.GetOrdinal("ReturnStationId")),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationNameFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationNameSwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationNameEng"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationAddressFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationAddressSwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationAddressFin"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationCityFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationCitySwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationCityFin"))),
                                        reader.GetString(reader.GetOrdinal("ReturnStationOperator")),
                                        reader.GetInt32(reader.GetOrdinal("ReturnStationCapacity")),
                                        reader.GetDecimal(reader.GetOrdinal("ReturnStationXCoordinate")),
                                        reader.GetDecimal(reader.GetOrdinal("ReturnStationYCoordinate")),
                                        reader.GetInt32(reader.GetOrdinal("CountTripsStartingFrom"))
                                    ));
                            }
                            details.TopFiveDestinationsFromStation = destinations;

                        }
                        reader.Close();

                        string query3 = @"select top 5 count(t.DepartureStationId) CountTripsEndingTo, t.DepartureStationId, t.DepartureStationNameFin, "
                                           + " t.DepartureStationNameSwe, t.DepartureStationNameEng, t.DepartureStationAddressFin, t.DepartureStationAddressSwe, t.DepartureStationCityFin, t.DepartureStationCitySwe, "
                                           + " t.DepartureStationOperator, t.DepartureStationCapacity, t.DepartureStationXCoordinate, t.DepartureStationYCoordinate "
                                           + $" from citybike.Trips_v t where t.ReturnStationId = @Id {departureDateFromCondition} {departureDateToCondition} "
                                           + " GROUP by t.DepartureStationId, t.DepartureStationNameFin, t.DepartureStationNameSwe, t.DepartureStationNameEng, t.DepartureStationAddressFin, t.DepartureStationAddressSwe, "
                                           + " t.DepartureStationCityFin, t.DepartureStationCitySwe, t.DepartureStationOperator, t.DepartureStationCapacity, t.DepartureStationXCoordinate, t.DepartureStationYCoordinate order by 1 desc ";

                        cmd1.CommandText = query3;

                        reader = cmd1.ExecuteReader();

                        if (reader.HasRows)
                        {
                            List<DetailedStation> origins = new();
                            while (reader.Read())
                            {
                                origins.Add(new DetailedStation(
                                reader.GetInt32(reader.GetOrdinal("DepartureStationId")),
                                    new Translations(reader.GetString(reader.GetOrdinal("DepartureStationNameFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationNameSwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationNameEng"))),
                                    new Translations(reader.GetString(reader.GetOrdinal("DepartureStationAddressFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationAddressSwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationAddressFin"))),
                                    new Translations(reader.GetString(reader.GetOrdinal("DepartureStationCityFin")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationCitySwe")),
                                    reader.GetString(reader.GetOrdinal("DepartureStationCityFin"))),
                                    reader.GetString(reader.GetOrdinal("DepartureStationOperator")),
                                    reader.GetInt32(reader.GetOrdinal("DepartureStationCapacity")),
                                    reader.GetDecimal(reader.GetOrdinal("DepartureStationXCoordinate")),
                                    reader.GetDecimal(reader.GetOrdinal("DepartureStationYCoordinate")),
                                    reader.GetInt32(reader.GetOrdinal("CountTripsEndingTo"))
                                ));
                            }
                            details.TopFiveOriginsToStation = origins;

                            reader.Close();
                            connection.Close();
                        }
                    }

                }
            }
            catch
            {
                throw;
            }

            return details;
        }

        public PaginatedTrips GetTrips(DateTime? departureDateFrom, DateTime? departureDateTo, string? departureStationName, string? returnStationName, string? sortBy, string? sortDir, int rowsPerPage, int page, string clientLanguage)
        {
            PaginatedTrips data = new();
            DateTime departureDateToEnd = new DateTime();
            if (departureDateTo != null)
            {
                departureDateToEnd = departureDateTo!.Value.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd1 = new SqlCommand())
                    {
                        cmd1.Connection = connection;
                        cmd1.CommandType = System.Data.CommandType.Text;

                        // Build query string depending on the incoming parameteres
                        string query = @"select count(1) from citybike.Trips_v t where 1 = 1 ";
                        // Search conditions
                        if (departureDateFrom != null)
                        {
                            query += " and t.DepartureDate >= @DepartureDateFrom ";
                            cmd1.Parameters.Add("DepartureDateFrom", SqlDbType.DateTime).Value = departureDateFrom;
                        }
                        if (departureDateTo != null)
                        {
                            query += " and t.DepartureDate <= @DepartureDateTo ";
                            cmd1.Parameters.Add("DepartureDateTo", SqlDbType.DateTime).Value = departureDateToEnd;
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
                            cmd1.Parameters.Add("DepartureStationName", SqlDbType.NVarChar).Value = $"%{departureStationName.ToLower()}%";
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
                            cmd1.Parameters.Add("ReturnStationName", SqlDbType.NVarChar).Value = $"%{returnStationName.ToLower()}%";
                        }

                        // Assign complete query string to CommandText
                        cmd1.CommandText = query;

                        connection.Open();
                        SqlDataReader reader = cmd1.ExecuteReader();

                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                data.TotalRowCount = reader.GetInt32(0);
                            }
                        }
                        reader.Close();
                        connection.Close();
                    }
                    if (data.TotalRowCount > 0)
                    {
                        using (SqlCommand cmd2 = new SqlCommand())
                        {
                            cmd2.Connection = connection;
                            cmd2.CommandType = System.Data.CommandType.Text;

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
                                cmd2.Parameters.Add("DepartureDateFrom", SqlDbType.DateTime).Value = departureDateFrom;
                            }
                            if (departureDateTo != null)
                            {
                                query += " and t.DepartureDate <= @DepartureDateTo ";
                                cmd2.Parameters.Add("DepartureDateTo", SqlDbType.DateTime).Value = departureDateToEnd;
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
                                cmd2.Parameters.Add("DepartureStationName", SqlDbType.NVarChar).Value = $"%{departureStationName.ToLower()}%";
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
                                cmd2.Parameters.Add("ReturnStationName", SqlDbType.NVarChar).Value = $"%{returnStationName.ToLower()}%";
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
                            cmd2.Parameters.Add("Offset", SqlDbType.Int).Value = page * rowsPerPage;
                            cmd2.Parameters.Add("RowsPerPage", SqlDbType.Int).Value = rowsPerPage;
                            // Assign complete query string to CommandText
                            cmd2.CommandText = query;

                            connection.Open();
                            SqlDataReader reader = cmd2.ExecuteReader();

                            while (reader.Read())
                            {
                                data.Trips.Add(new Trip(
                                    reader.GetInt32(reader.GetOrdinal("Id")),
                                    reader.GetDateTime(reader.GetOrdinal("DepartureDate")),
                                    reader.GetDateTime(reader.GetOrdinal("ReturnDate")),
                                    new Station(
                                        reader.GetInt32(reader.GetOrdinal("DepartureStationId")),
                                        new Translations(reader.GetString(reader.GetOrdinal("DepartureStationNameFin")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationNameSwe")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationNameEng"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("DepartureStationAddressFin")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationAddressSwe")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationAddressFin"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("DepartureStationCityFin")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationCitySwe")),
                                        reader.GetString(reader.GetOrdinal("DepartureStationCityFin"))),
                                        reader.GetString(reader.GetOrdinal("DepartureStationOperator")),
                                        reader.GetInt32(reader.GetOrdinal("DepartureStationCapacity")),
                                        reader.GetDecimal(reader.GetOrdinal("DepartureStationXCoordinate")),
                                        reader.GetDecimal(reader.GetOrdinal("DepartureStationYCoordinate"))
                                        ),
                                    new Station(
                                        reader.GetInt32(reader.GetOrdinal("ReturnStationId")),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationNameFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationNameSwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationNameEng"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationAddressFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationAddressSwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationAddressFin"))),
                                        new Translations(reader.GetString(reader.GetOrdinal("ReturnStationCityFin")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationCitySwe")),
                                        reader.GetString(reader.GetOrdinal("ReturnStationCityFin"))),
                                        reader.GetString(reader.GetOrdinal("ReturnStationOperator")),
                                        reader.GetInt32(reader.GetOrdinal("ReturnStationCapacity")),
                                        reader.GetDecimal(reader.GetOrdinal("ReturnStationXCoordinate")),
                                        reader.GetDecimal(reader.GetOrdinal("ReturnStationYCoordinate"))
                                        ),
                                    reader.GetInt32(reader.GetOrdinal("CoveredDistanceInMeters")),
                                    reader.GetInt32(reader.GetOrdinal("DurationInSeconds"))
                                    ));
                                data.RowsFrom = page * rowsPerPage + 1;
                                data.RowsTo = page * rowsPerPage + data.Trips.Count;
                            }
                            reader.Close();
                            connection.Close();
                        }
                    }
                }
                return data;
            }
            catch
            {
                throw;
            }
        }

        public int InsertNewTrip(NewTripIn trip)
        {
            int createdTrip;

            try
            {
                using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("CityBikeDB")))
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = connection;
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.CommandText = "citybike.InsertNewTrip";

                        cmd.Parameters.Add("departure_date", SqlDbType.DateTime).Value = trip.DepartureDate;
                        cmd.Parameters.Add("return_date", SqlDbType.DateTime).Value = trip.ReturnDate;
                        cmd.Parameters.Add("departure_station_id", SqlDbType.Int).Value = trip.DepartureStationId;
                        cmd.Parameters.Add("return_station_id", SqlDbType.Int).Value = trip.ReturnStationId;
                        cmd.Parameters.Add("distance", SqlDbType.Int).Value = trip.DistanceMeters;
                        cmd.Parameters.Add("duration", SqlDbType.Int).Value = trip.DurationSeconds;
                        SqlParameter newId = new SqlParameter("new_id", SqlDbType.Int);
                        newId.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(newId);

                        connection.Open();
                        cmd.ExecuteNonQuery();
                        createdTrip = (int)newId.Value;
                    }
                    connection.Close();
                }
                return createdTrip;
            }
            catch
            {
                throw;
            }
        }
    }
}
