using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MY_APP.Models;
using MY_APP.Services.Interfaces;

namespace MY_APP.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private const string SecretKey = "YOUR_SECRET_KEY_HERE"; // Move to config

        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[] { new System.Security.Claims.Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            // Implement refresh token generation logic
            return Guid.NewGuid().ToString();
        }
    }
}
