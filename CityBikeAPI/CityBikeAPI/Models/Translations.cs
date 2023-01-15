using System;
namespace CityBikeAPI.Models
{
    public class Translations
    {
        public string Fin { get; set; } = "";
        public string Swe { get; set; } = "";
        public string Eng { get; set; } = "";

        public Translations(string _fin, string _swe, string _eng)
        {
            Fin = _fin;
            Swe = _swe;
            Eng = _eng;
        }
    }
}

