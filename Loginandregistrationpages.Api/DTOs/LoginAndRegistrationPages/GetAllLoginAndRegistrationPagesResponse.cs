using System;
using System.Collections.Generic;

namespace Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages
{
    public class GetAllLoginAndRegistrationPagesResponse
    {
        public List<GetLoginAndRegistrationPagesByIdResponse> Items { get; set; } = new List<GetLoginAndRegistrationPagesByIdResponse>();
    }
}
