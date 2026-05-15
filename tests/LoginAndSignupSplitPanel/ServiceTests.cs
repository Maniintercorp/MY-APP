using Xunit;
using Moq;
using FluentAssertions;
using System.Threading.Tasks;
using YourNamespace.Services;
using YourNamespace.Models;

public class LoginAndSignupServiceTests
{
    private readonly Mock<IRepository<SignupRequest>> _signupRepository;
    private readonly LoginAndSignupService _service;

    public LoginAndSignupServiceTests()
    {
        _signupRepository = new Mock<IRepository<SignupRequest>>();
        _service = new LoginAndSignupService(_signupRepository.Object);
    }

    [Fact]
    public async Task Signup_Should_Call_Repository_With_Correct_Data()
    {
        var signupRequest = new SignupRequest { Name = "John", Email = "john@example.com", Password = "123456" };

        await _service.Signup(signupRequest);

        _signupRepository.Verify(r => r.AddAsync(It.Is<SignupRequest>(s => 
        s.Email == signupRequest.Email && 
        s.Name == signupRequest.Name)), Times.Once);
    }
}
