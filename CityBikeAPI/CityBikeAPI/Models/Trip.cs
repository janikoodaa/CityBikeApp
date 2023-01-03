using System;
namespace CityBikeAPI.Models
{
    public class Trip
    {
        public int Id { get; private set; }
        public DateTime DepartureDate { get; private set; }
        public DateTime ReturnDate { get; private set; }
        public Station DepartureStation { get; private set; }
        public Station ReturnStation { get; private set; }
        public int DistanceMeters { get; private set; }
        public int DurationSeconds { get; private set; }

        public Trip(int _id, DateTime _departureDate, DateTime _returnDate, Station _departureStation, Station _returnStation, int _distanceMeters, int _durationSeconds)
        {
            Id = _id;
            DepartureDate = _departureDate;
            ReturnDate = _returnDate;
            DepartureStation = _departureStation;
            ReturnStation = _returnStation;
            DistanceMeters = _distanceMeters;
            DurationSeconds = _durationSeconds;
        }
    }
}

