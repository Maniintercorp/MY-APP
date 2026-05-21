using AutoMapper;
using Loginandregistrationpages.Api.DTOs.LoginRegistrationPage;
using Loginandregistrationpages.Api.Models;

namespace Loginandregistrationpages.Api.Mappings;

public sealed class LoginRegistrationPageMappingProfile : Profile
{
    public LoginRegistrationPageMappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(destination => destination.Id, options => options.MapFrom(source => source.Id.ToString()))
            .ForMember(destination => destination.CreatedAtUtc, options => options.MapFrom(source => source.CreatedAtUtc.ToString("O")));

        CreateMap<RegisterRequestDto, User>()
            .ForMember(destination => destination.Id, options => options.Ignore())
            .ForMember(destination => destination.NormalizedEmail, options => options.MapFrom(source => source.Email.Trim().ToUpperInvariant()))
            .ForMember(destination => destination.PasswordHash, options => options.Ignore())
            .ForMember(destination => destination.IsActive, options => options.MapFrom(_ => true))
            .ForMember(destination => destination.CreatedAtUtc, options => options.Ignore())
            .ForMember(destination => destination.UpdatedAtUtc, options => options.Ignore())
            .ForMember(destination => destination.LastLoginAtUtc, options => options.Ignore());

        CreateMap<User, LoginRegistrationPageEntity>()
            .ForMember(destination => destination.Email, options => options.MapFrom(source => source.Email))
            .ForMember(destination => destination.NormalizedEmail, options => options.MapFrom(source => source.NormalizedEmail))
            .ForMember(destination => destination.FirstName, options => options.MapFrom(source => source.FirstName))
            .ForMember(destination => destination.LastName, options => options.MapFrom(source => source.LastName))
            .ForMember(destination => destination.IsActive, options => options.MapFrom(source => source.IsActive));
    }
}
