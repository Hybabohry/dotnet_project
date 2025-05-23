using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Back_HR.DTOs
{
    public class SurveyResponseDTO
    {
        [Required(ErrorMessage = "L'ID du sondage est requis.")]
        public Guid SurveyId { get; set; }

        [Required(ErrorMessage = "L'ID de l'employ� est requis.")]
        public Guid EmployeeId { get; set; }

        [Required(ErrorMessage = "Les r�ponses sont requises.")]
        public List<string> Answers { get; set; } = new List<string>();
    }
}