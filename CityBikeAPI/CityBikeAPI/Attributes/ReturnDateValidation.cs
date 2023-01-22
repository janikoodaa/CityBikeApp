using System;
using System.ComponentModel.DataAnnotations;

namespace CityBikeAPI.Models
{
    public class ReturnDateValidation : ValidationAttribute
    {
        protected override ValidationResult?
                    IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("Return date is mandatory.");
            }
            var model = (Models.NewTripIn)validationContext.ObjectInstance;
            DateTime _returnDate = Convert.ToDateTime(value);
            DateTime _departureDate = Convert.ToDateTime(model.DepartureDate);

            if (_returnDate > DateTime.Now)
            {
                return new ValidationResult
                    ("Return date can not be in future.");
            }
            else if ((_returnDate - _departureDate).TotalSeconds < 10)
            {
                return new ValidationResult
                    ("Return date must be at least 10 seconds later, than departure date.");
            }
            else
            {
                return ValidationResult.Success;
            }
        }
    }
}

