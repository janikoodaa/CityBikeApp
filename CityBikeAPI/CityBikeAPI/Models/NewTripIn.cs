using System;
using System.ComponentModel.DataAnnotations;
using CityBikeAPI.Attributes;

namespace CityBikeAPI.Models
{
    public class NewTripIn
    {
        [DataType(DataType.DateTime)]
        [DepartureDateValidation]
        public DateTime DepartureDate { get; set; }

        [DataType(DataType.DateTime)]
        [ReturnDateValidation]
        public DateTime ReturnDate { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int DepartureStationId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int ReturnStationId { get; set; }

        [Required]
        [Range(10, int.MaxValue, ErrorMessage = "Distance must be given in meters, at least 10 meters.")]
        public int DistanceMeters { get; set; }

        public int DurationSeconds => Convert.ToInt32((ReturnDate - DepartureDate).TotalSeconds);

    }
}

