using Back_HR.Models;
using System.Text.Json.Serialization;

namespace Back_HR.DTOs
{
    public class RegisterModel
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Telephone { get; set; }

        public List<Competence> Competences { get; set; }
        
        [JsonIgnore]
        public IFormFile? CvFile { get; set; }
        
        public string? CvBase64 { get; set; }
    }
}
