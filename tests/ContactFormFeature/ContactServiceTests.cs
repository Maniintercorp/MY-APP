using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using MyProject.DTOs;
using MyProject.Repositories;
using MyProject.Services;
using Xunit;

namespace tests.ContactFormFeature
{
    public class ContactServiceTests
    {
        private readonly Mock<IContactRepository> _mockRepository;
        private readonly ContactService _contactService;

        public ContactServiceTests()
        {
            _mockRepository = new Mock<IContactRepository>();
            _contactService = new ContactService(_mockRepository.Object, Mock.Of<ILogger<ContactService>>());
        }

        [Fact]
        public async Task SubmitContactAsync_ShouldReturnTrue_WhenRepositoryReturnsTrue()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "John Doe", Email = "john.doe@example.com", Message = "Hello" };
            _mockRepository.Setup(repo => repo.AddContactAsync(contactDto)).ReturnsAsync(true);

            // Act
            bool result = await _contactService.SubmitContactAsync(contactDto);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task SubmitContactAsync_ShouldReturnFalse_WhenRepositoryReturnsFalse()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "John Doe", Email = "john.doe@example.com", Message = "Hello" };
            _mockRepository.Setup(repo => repo.AddContactAsync(contactDto)).ReturnsAsync(false);

            // Act
            bool result = await _contactService.SubmitContactAsync(contactDto);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task SubmitContactAsync_ShouldHandleExceptionAndReturnFalse()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "John Doe", Email = "john.doe@example.com", Message = "Hello" };
            _mockRepository.Setup(repo => repo.AddContactAsync(contactDto)).ThrowsAsync(new Exception("Database failure"));

            // Act
            bool result = await _contactService.SubmitContactAsync(contactDto);

            // Assert
            result.Should().BeFalse();
        }
    }
}
