using Xunit;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;
using System.Net;
using System.Text;
using Newtonsoft.Json;
using DTOs;
using System.Threading.Tasks;

namespace ContactControllerTests
{
    public class ContactControllerTests : IClassFixture<WebApplicationFactory<YourProject.Startup>>
    {
        private readonly HttpClient _client;

        public ContactControllerTests(WebApplicationFactory<YourProject.Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task SubmitContactForm_ShouldReturnOk_WhenContactIsValid()
        {
            // Arrange
            var contactDto = new ContactDTO { Name = "Jane Doe", Email = "jane@example.com", Message = "Hi!" };
            var content = new StringContent(JsonConvert.SerializeObject(contactDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/contact", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseString = await response.Content.ReadAsStringAsync();
            responseString.Should().Contain("Form submitted successfully.");
        }

        [Fact]
        public async Task SubmitContactForm_ShouldReturnBadRequest_WhenContactIsInvalid()
        {
            // Arrange
            var contactDto = new ContactDTO { Name = "", Email = "not-an-email", Message = "" };
            var content = new StringContent(JsonConvert.SerializeObject(contactDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/contact", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}