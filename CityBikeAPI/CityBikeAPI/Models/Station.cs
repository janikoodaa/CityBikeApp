using System;
namespace CityBikeAPI.Models
{
    public class Station
    {
        public int Id { get; set; }
        public Translations Name { get; set; }
        public Translations Address { get; set; }
        public Translations City { get; set; }
        public string Operator { get; set; }
        public int Capacity { get; set; }
        public decimal XCoordinate { get; set; }
        public decimal YCoordinate { get; set; }


        public Station(int _id, Translations _name, Translations _address, Translations _city, string _operator, int _capacity, decimal _xCoordinate, decimal _yCoordinate)

        {
            Id = _id;
            Name = _name;
            Address = _address;
            City = _city;
            Operator = _operator;
            Capacity = _capacity;
            XCoordinate = _xCoordinate;
            YCoordinate = _yCoordinate;
        }
    }
}

