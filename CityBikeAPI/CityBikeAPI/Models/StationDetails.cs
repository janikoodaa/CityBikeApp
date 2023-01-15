using System;
namespace CityBikeAPI.Models
{
    public class StationDetails
    {
        public int StationId { get; set; }
        public int TripsCountFromStation { get; set; }
        public int TripsCountToStation { get; set; }
        public int AverageDistanceFromStation { get; set; }
        public int AverageDistanceToStation { get; set; }
        public List<DetailedStation> TopFiveDestinationsFromStation { get; set; } = new();
        public List<DetailedStation> TopFiveOriginsToStation { get; set; } = new();
    }
}

