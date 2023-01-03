using System;
using System.Data;
using System.Runtime.ConstrainedExecution;
using Microsoft.Data.SqlClient;
using CityBikeAPI.Models;
using System.Configuration;

namespace CityBikeAPI.Data
{
    public class SqlServerCityBikeRepo : ICityBikeRepository
    {
        private readonly IConfiguration _configuration;

        public SqlServerCityBikeRepo(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<Station> GetStations(string? name, string? address, string? city, string? sortBy, string? sortDir, int rowsPerPage, int page, string language)
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
                            if (language.ToLower() == "fin") query += " and lower(s.NameFin) like @Name ";
                            if (language.ToLower() == "swe") query += " and lower(s.NameSwe) like @Name ";
                            if (language.ToLower() == "eng") query += " and lower(s.NameEng) like @Name ";
                            cmd.Parameters.Add("Name", SqlDbType.NVarChar).Value = $"%{name.ToLower()}%";
                        }
                        if (address != null)
                        {
                            if (language.ToLower() == "fin" || language.ToLower() == "eng") query += " and lower(s.AddressFin) like @Address ";
                            if (language.ToLower() == "swe") query += " and lower(s.AddressSwe) like @Address ";
                            cmd.Parameters.Add("Address", SqlDbType.NVarChar).Value = $"%{address.ToLower()}%";
                        }
                        if (city != null)
                        {
                            if (language.ToLower() == "fin" || language.ToLower() == "eng") query += " and lower(s.CityFin) like @City ";
                            if (language.ToLower() == "swe") query += " and lower(s.CitySwe) like @City ";
                            cmd.Parameters.Add("City", SqlDbType.NVarChar).Value = $"%{city.ToLower()}%";
                        }
                        // Order by
                        query += " order by ";
                        if (sortBy?.ToLower() == "address")
                        {
                            if (language.ToLower() == "fin" || language.ToLower() == "eng") query += " s.AddressFin ";
                            if (language.ToLower() == "swe") query += " s.AddressSwe ";
                        }
                        else if (sortBy?.ToLower() == "city")
                        {
                            if (language.ToLower() == "fin" || language.ToLower() == "eng") query += " s.CityFin ";
                            if (language.ToLower() == "swe") query += " s.CitySwe ";
                        }
                        else
                        {
                            if (language.ToLower() == "fin") query += " s.NameFin ";
                            if (language.ToLower() == "swe") query += " s.NameSwe ";
                            if (language.ToLower() == "eng") query += " s.NameEng ";
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

        public List<Trip> GetTrips(DateOnly? departureDate, DateOnly? returnDate, string? departureStationName, string? returnStationName, string? sortBy, string? sortDir, int rowsPerPage, int page, string language)
        {
            throw new NotImplementedException();
        }

    }
}
