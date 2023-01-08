using System;
namespace CityBikeAPI.Models
{
    public class PaginatedStations
    {
        public int RowsFrom { get; set; }
        public int RowsTo { get; set; }
        public int TotalRowCount { get; set; }
        public List<Station> Stations { get; set; } = new();
    }
}

