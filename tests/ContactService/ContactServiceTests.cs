using Moq;
using Xunit;
using Services;
using DTOs;
using Repositories;
using Models;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ContactServiceTests
{
    public class ContactServiceTests
    {
        private readonly Mock<IContactRepository> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILogger<ContactService>> _loggerMock;
        private readonly IContactService _service;

        public ContactServiceTests()
        {
            _repositoryMock = new Mock<IContactRepository>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<ContactService>>();
            _service = new ContactService(_repositoryMock.Object, _mapperMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task SubmitContactFormAsync_ShouldReturnTrueAndCallRepository_WhenDtoIsValid()
        {
            // Arrange
            var contactDto = new ContactDTO { Name = "John", Email = "john@example.com", Message = "Hello!" };
            var contact = new Contact();
            _mapperMock.Setup(m => m.Map<Contact>(contactDto)).Returns(contact);

            // Act
            var result = await _service.SubmitContactFormAsync(contactDto);

            // Assert
            result.Should().BeTrue();
            _repositoryMock.Verify(r => r.AddContactAsync(contact), Times.Once);
        }

        [Fact]
        public async Task SubmitContactFormAsync_ShouldReturnFalse_AndLogErrorOnException()
        {
            // Arrange
            var contactDto = new ContactDTO { Name = "John", Email = "john@example.com", Message = "Hello!" };
            _mapperMock.Setup(m => m.Map<Contact>(contactDto)).Throws(new System.Exception());

            // Act
            var result = await _service.SubmitContactFormAsync(contactDto);

            // Assert
            result.Should().BeFalse();
            _loggerMock.Verify(log => log.LogError(It.IsAny<Exception>(), "Error occurred while submitting contact form."), Times.Once);
        }
    }
}