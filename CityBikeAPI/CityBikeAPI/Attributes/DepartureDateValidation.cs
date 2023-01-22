using System;
using System.ComponentModel.DataAnnotations;

namespace CityBikeAPI.Attributes
{

    public class DepartureDateValidation : ValidationAttribute
    {
        protected override ValidationResult?
                    IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("Departure date is mandatory.");
            }
            var model = (Models.NewTripIn)validationContext.ObjectInstance;
            DateTime _departureDate = Convert.ToDateTime(value);
            DateTime _returnDate = Convert.ToDateTime(model.ReturnDate);


            if ((_returnDate - _departureDate).TotalSeconds < 10)
            {
                return new ValidationResult
                    ("Departure date must be at least 10 seconds earlier, than  return date.");
            }
            else
            {
                return ValidationResult.Success;
            }
        }
    }

}

