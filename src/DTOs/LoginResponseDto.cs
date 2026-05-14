namespace MY_APP.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public int ExpiresIn { get; set; }
        public string RefreshToken { get; set; }
    }
}
