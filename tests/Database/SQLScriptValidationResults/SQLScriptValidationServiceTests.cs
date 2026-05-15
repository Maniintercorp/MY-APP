using Xunit;
using Moq;
using FluentAssertions;
using MyProject.Database.Services;
using MyProject.Database.Entities;
using MyProject.Database.Repositories;
using System.Threading.Tasks;

public class SQLScriptValidationServiceTests
{
    private readonly Mock<ISQLScriptValidationResultRepository> _repositoryMock;
    private readonly SQLScriptValidationService _service;

    public SQLScriptValidationServiceTests()
    {
        _repositoryMock = new Mock<ISQLScriptValidationResultRepository>();
        _service = new SQLScriptValidationService(_repositoryMock.Object);
    }

    [Fact]
    public async Task AddValidationResult_ShouldAddResult()
    {
        // Arrange
        var result = new SQLScriptValidationResult { IsValid = true, ValidationErrors = null };

        // Act
        await _service.AddValidationResult(result);

        // Assert
        _repositoryMock.Verify(repo => repo.AddAsync(result), Times.Once);
    }

    [Fact]
    public async Task GetValidationResults_ShouldReturnAllResults()
    {
        // Arrange
        var results = new List<SQLScriptValidationResult>
        {
            new SQLScriptValidationResult { Id = 1, IsValid = true },
            new SQLScriptValidationResult { Id = 2, IsValid = false }
        };

        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(results);

        // Act
        var returnedResults = await _service.GetValidationResults();

        // Assert
        returnedResults.Should().BeEquivalentTo(results);
    }

    // More tests for update and delete methods...
}
