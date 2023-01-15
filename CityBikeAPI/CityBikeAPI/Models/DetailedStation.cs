using System;
namespace CityBikeAPI.Models
{
    public class DetailedStation : Station
    {
        public int CountOfTrips { get; set; }

        public DetailedStation(int _id, Translations _name, Translations _address, Translations _city, string _operator, int _capacity, decimal _xCoordinate, decimal _yCoordinate, int _countOfTrips) : base(_id, _name, _address, _city, _operator, _capacity, _xCoordinate, _yCoordinate)
        {
            CountOfTrips = _countOfTrips;
        }
    }
}

