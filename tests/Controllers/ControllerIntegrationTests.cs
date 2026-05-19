using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Inventorymanagementsystem.Common;
using Inventorymanagementsystem.DTOs.Auth;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;
using Inventorymanagementsystem.Tests.TestSupport;

namespace Inventorymanagementsystem.Tests.Controllers;

public class ControllerIntegrationTests : IClassFixture<TestHostFactory>
{
    private readonly TestHostFactory _factory;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public ControllerIntegrationTests(TestHostFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task AuthRegister_ShouldReturnCreatedAndToken()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/Auth/register", new RegisterRequest
        {
            FullName = "Integration User",
            Email = $"user-{Guid.NewGuid():N}@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>(JsonOptions);
        body.Should().NotBeNull();
        body!.Success.Should().BeTrue();
        body.Data!.Token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task AuthLogin_ShouldReturnUnauthorized_ForInvalidCredentials()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/Auth/login", new LoginRequest
        {
            Email = "missing@example.com",
            Password = "Password123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>(JsonOptions);
        body!.Success.Should().BeFalse();
    }

    [Fact]
    public async Task InventoryManagementSystemEndpoints_ShouldRequireAuthAndSupportCrudFlow()
    {
        var anonymousClient = _factory.CreateClient();
        var anonymousResponse = await anonymousClient.GetAsync("/api/InventoryManagementSystem");
        anonymousResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var client = _factory.CreateClient();
        var token = await RegisterAndGetTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createResponse = await client.PostAsJsonAsync("/api/InventoryManagementSystem", new CreateInventoryManagementSystemRequest
        {
            Name = "Integration Item",
            Description = "Created from integration test",
            Status = "Active"
        });
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdBody = await createResponse.Content.ReadFromJsonAsync<ApiResponse<InventoryManagementSystemResponse>>(JsonOptions);
        createdBody!.Success.Should().BeTrue();
        var id = createdBody.Data!.Id;

        var getResponse = await client.GetAsync($"/api/InventoryManagementSystem/{id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var getBody = await getResponse.Content.ReadFromJsonAsync<ApiResponse<InventoryManagementSystemResponse>>(JsonOptions);
        getBody!.Data!.Name.Should().Be("Integration Item");

        var listResponse = await client.GetAsync("/api/InventoryManagementSystem?search=Integration&page=1&pageSize=5");
        listResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var listBody = await listResponse.Content.ReadFromJsonAsync<ApiResponse<PagedResult<InventoryManagementSystemResponse>>>(JsonOptions);
        listBody!.Data!.Items.Should().Contain(x => x.Id == id);

        var updateResponse = await client.PutAsJsonAsync($"/api/InventoryManagementSystem/{id}", new UpdateInventoryManagementSystemRequest
        {
            Name = "Updated Integration Item",
            Description = "Updated",
            Status = "Draft"
        });
        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedBody = await updateResponse.Content.ReadFromJsonAsync<ApiResponse<InventoryManagementSystemResponse>>(JsonOptions);
        updatedBody!.Data!.Status.Should().Be("Draft");

        var deleteResponse = await client.DeleteAsync($"/api/InventoryManagementSystem/{id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var deletedBody = await deleteResponse.Content.ReadFromJsonAsync<ApiResponse<bool>>(JsonOptions);
        deletedBody!.Data.Should().BeTrue();

        var getDeletedResponse = await client.GetAsync($"/api/InventoryManagementSystem/{id}");
        getDeletedResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task InventoryManagementSystemCreate_ShouldReturnBadRequest_WhenValidationFails()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await RegisterAndGetTokenAsync(client));

        var response = await client.PostAsJsonAsync("/api/InventoryManagementSystem", new CreateInventoryManagementSystemRequest
        {
            Name = "",
            Description = new string('x', 501),
            Status = "Active"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var contentType = response.Content.Headers.ContentType!.MediaType;
        contentType.Should().Be("application/problem+json");
    }

    private static async Task<string> RegisterAndGetTokenAsync(HttpClient client)
    {
        var registerResponse = await client.PostAsJsonAsync("/api/Auth/register", new RegisterRequest
        {
            FullName = "Token User",
            Email = $"token-{Guid.NewGuid():N}@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        });
        registerResponse.EnsureSuccessStatusCode();
        var body = await registerResponse.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>(JsonOptions);
        return body!.Data!.Token;
    }
}
