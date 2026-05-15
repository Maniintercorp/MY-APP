using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using MyProject;
using MyProject.DTOs;
using Newtonsoft.Json;
using Xunit;

namespace tests.ContactFormFeature
{
    public class ContactControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public ContactControllerTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task SubmitContact_ReturnsOk_WhenDataIsValid()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "John Doe", Email = "john.doe@example.com", Message = "Hello" };
            var content = new StringContent(JsonConvert.SerializeObject(contactDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/contact", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var responseContent = await response.Content.ReadAsStringAsync();
            responseContent.Should().Contain("success":true);
        }

        [Fact]
        public async Task SubmitContact_ReturnsBadRequest_WhenDataIsInvalid()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "", Email = "invalid-email", Message = "" };
            var content = new StringContent(JsonConvert.SerializeObject(contactDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/contact", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var responseContent = await response.Content.ReadAsStringAsync();
            responseContent.Should().Contain("success":false);
        }

        [Fact]
        public async Task SubmitContact_ReturnsInternalServerError_WhenServiceFails()
        {
            // Setup mock for failing service to simulate error
            // This test assumes that the mock or override of SubmitContactAsync simulates a failure not shown in this context
            
            var contactDto = new ContactDto { Name = "Jane Doe", Email = "jane.doe@example.com", Message = "Hi" };
            var content = new StringContent(JsonConvert.SerializeObject(contactDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/contact", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
            var responseContent = await response.Content.ReadAsStringAsync();
            responseContent.Should().Contain("success":false);
        }
    }
}
