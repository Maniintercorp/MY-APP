using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Commands.LoginAndRegistrationPages
{
    public class CreateLoginAndRegistrationPagesCommand : IRequest<ApiResponse<CreateLoginAndRegistrationPagesResponse>>
    {
        public CreateLoginAndRegistrationPagesRequest Request { get; }
        public CreateLoginAndRegistrationPagesCommand(CreateLoginAndRegistrationPagesRequest request) => Request = request;
    }

    public class CreateLoginAndRegistrationPagesCommandHandler : IRequestHandler<CreateLoginAndRegistrationPagesCommand, ApiResponse<CreateLoginAndRegistrationPagesResponse>>
    {
        private readonly AppDbContext _db;
        private readonly ILogger<CreateLoginAndRegistrationPagesCommandHandler> _logger;
        private readonly IMapper _mapper;
        private readonly ICacheService _cache;
        public CreateLoginAndRegistrationPagesCommandHandler(AppDbContext db, ILogger<CreateLoginAndRegistrationPagesCommandHandler> logger, IMapper mapper, ICacheService cache)
        {
            _db = db;
            _logger = logger;
            _mapper = mapper;
            _cache = cache;
        }
        public async Task<ApiResponse<CreateLoginAndRegistrationPagesResponse>> Handle(CreateLoginAndRegistrationPagesCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<LoginAndRegistrationPagesEntity>(request.Request);
            _db.LoginAndRegistrationPages.Add(entity);
            await _db.SaveChangesAsync(cancellationToken);
            // Invalidate cache
            await _cache.RemoveAsync("loginandregistrationpages:all", cancellationToken);
            _logger.LogInformation($"Created LoginAndRegistrationPages entity {entity.Id}");
            var resp = _mapper.Map<CreateLoginAndRegistrationPagesResponse>(entity);
            return ApiResponse<CreateLoginAndRegistrationPagesResponse>.Ok(resp);
        }
    }
}
