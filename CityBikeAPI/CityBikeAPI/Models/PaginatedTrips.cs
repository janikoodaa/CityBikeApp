using System;
namespace CityBikeAPI.Models
{
    public class PaginatedTrips
    {
        public int RowsFrom { get; set; }
        public int RowsTo { get; set; }
        public int TotalRowCount { get; set; }
        public List<Trip> Trips { get; set; } = new();
    }
}

