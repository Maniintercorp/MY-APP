using Xunit;
using System.Net;
using System.Threading.Tasks;
using MyProject;
using MyProject.Database.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

public class SQLScriptValidationResultsControllerTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;

    public SQLScriptValidationResultsControllerTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_ShouldReturnValidationResults()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/sqlscriptvalidationresults");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Post_ShouldAddValidationResult()
    {
        // Arrange
        var client = _factory.CreateClient();
        var newResult = new SQLScriptValidationResult { IsValid = true, ValidationErrors = "" };

        // Act
        var response = await client.PostAsJsonAsync("/api/sqlscriptvalidationresults", newResult);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    // Additional tests for update and delete endpoints...
}
