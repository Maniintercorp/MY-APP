using FluentAssertions;
using Moq;
using System.Threading.Tasks;
using Xunit;
using MyProject.Services;
using MyProject.Repositories;
using MyProject.DTOs;
using MyProject.Models;
using AutoMapper;

namespace MyProject.Tests.ContactFormFeature
{
    public class ContactServiceTests
    {
        private readonly Mock<IContactRepository> _contactRepositoryMock = new Mock<IContactRepository>();
        private readonly Mock<IMapper> _mapperMock = new Mock<IMapper>();
        private readonly ContactService _service;

        public ContactServiceTests()
        {
            _service = new ContactService(_contactRepositoryMock.Object, _mapperMock.Object, Mock.Of<ILogger<ContactService>>());
        }

        [Fact]
        public async Task SaveContactAsync_ShouldSaveContact_ReturnContactResponseDto()
        {
            // Arrange
            var contactDto = new ContactDto { Name = "John Doe", Email = "john@example.com", Message = "Hello!" };
            var contact = new Contact { Id = 1, Name = "John Doe", Email = "john@example.com", Message = "Hello!", CreatedAt = DateTime.UtcNow };
            var contactResponseDto = new ContactResponseDto { Id = 1, CreatedAt = contact.CreatedAt.ToString() };

            _mapperMock.Setup(m => m.Map<Contact>(contactDto)).Returns(contact);
            _mapperMock.Setup(m => m.Map<ContactResponseDto>(contact)).Returns(contactResponseDto);
            _contactRepositoryMock.Setup(r => r.AddAsync(contact)).ReturnsAsync(contact);

            // Act
            var result = await _service.SaveContactAsync(contactDto);

            // Assert
            result.Should().BeEquivalentTo(contactResponseDto);
            _contactRepositoryMock.Verify(r => r.AddAsync(contact), Times.Once);
        }
    }
}
