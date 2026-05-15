namespace MyProject.DTOs
{
    public class ContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }

    public class ContactResponseDto
    {
        public int Id { get; set; }
        public string CreatedAt { get; set; }
    }
}