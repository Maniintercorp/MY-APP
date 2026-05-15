using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using MyProject;
using Xunit;

namespace MyProject.Tests.ContactFormFeature
{
    public class ContactControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public ContactControllerIntegrationTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task PostContact_ShouldReturnCreatedResponse()
        {
            // Arrange
            var contactDto = new
            {
                Name = "Jane Doe",
                Email = "jane.doe@example.com",
                Message = "Hello there!"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/contact", contactDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var responseData = await response.Content.ReadAsAsync<object>();
            responseData.Should().NotBeNull();
        }

        [Fact]
        public async Task PostContact_WhenInvalidData_ShouldReturnBadRequest()
        {
            // Arrange
            var contactDto = new
            {
                Name = "",
                Email = "invalid-email",
                Message = ""
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/contact", contactDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}
