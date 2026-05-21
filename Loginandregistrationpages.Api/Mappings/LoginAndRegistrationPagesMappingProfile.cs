using AutoMapper;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;

namespace Loginandregistrationpages.Api.Mappings
{
    public class LoginAndRegistrationPagesMappingProfile : Profile
    {
        public LoginAndRegistrationPagesMappingProfile()
        {
            CreateMap<CreateLoginAndRegistrationPagesRequest, LoginAndRegistrationPagesEntity>();
            CreateMap<UpdateLoginAndRegistrationPagesRequest, LoginAndRegistrationPagesEntity>();
            CreateMap<LoginAndRegistrationPagesEntity, CreateLoginAndRegistrationPagesResponse>();
            CreateMap<LoginAndRegistrationPagesEntity, UpdateLoginAndRegistrationPagesResponse>();
            CreateMap<LoginAndRegistrationPagesEntity, GetLoginAndRegistrationPagesByIdResponse>();
        }
    }
}
