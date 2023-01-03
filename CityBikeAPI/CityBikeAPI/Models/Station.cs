using System;
namespace CityBikeAPI.Models
{
    public class Station
    {
        public int Id { get; private set; }
        public string NameFin { get; private set; }
        public string NameSwe { get; private set; }
        public string NameEng { get; private set; }
        public string AddressFin { get; private set; }
        public string AddressSwe { get; private set; }
        public string CityFin { get; private set; }
        public string CitySwe { get; private set; }
        public string Operator { get; private set; }
        public int Capacity { get; private set; }
        public decimal XCoordinate { get; private set; }
        public decimal YCoordinate { get; private set; }


        public Station(int _id, string _nameFin, string _nameSwe, string _nameEng, string _addressFin, string _addressSwe, string _cityFin, string _citySwe, string _operator, int _capacity, decimal _xCoordinate, decimal _yCoordinate)
        {
            Id = _id;
            NameFin = _nameFin;
            NameSwe = _nameSwe;
            NameEng = _nameEng;
            AddressFin = _addressFin;
            AddressSwe = _addressSwe;
            CityFin = _cityFin;
            CitySwe = _citySwe;
            Operator = _operator;
            Capacity = _capacity;
            XCoordinate = _xCoordinate;
            YCoordinate = _yCoordinate;
        }
    }
}

