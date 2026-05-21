using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Data;
using MediatR;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Commands.LoginAndRegistrationPages
{
    public class UpdateLoginAndRegistrationPagesCommand : IRequest<ApiResponse<UpdateLoginAndRegistrationPagesResponse>>
    {
        public Guid Id { get; }
        public UpdateLoginAndRegistrationPagesRequest Request { get; }
        public UpdateLoginAndRegistrationPagesCommand(Guid id, UpdateLoginAndRegistrationPagesRequest request)
        {
            Id = id;
            Request = request;
        }
    }

    public class UpdateLoginAndRegistrationPagesCommandHandler : IRequestHandler<UpdateLoginAndRegistrationPagesCommand, ApiResponse<UpdateLoginAndRegistrationPagesResponse>>
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly ILogger<UpdateLoginAndRegistrationPagesCommandHandler> _logger;
        private readonly ICacheService _cache;
        public UpdateLoginAndRegistrationPagesCommandHandler(AppDbContext db, IMapper mapper, ILogger<UpdateLoginAndRegistrationPagesCommandHandler> logger, ICacheService cache)
        {
            _db = db;
            _mapper = mapper;
            _logger = logger;
            _cache = cache;
        }
        public async Task<ApiResponse<UpdateLoginAndRegistrationPagesResponse>> Handle(UpdateLoginAndRegistrationPagesCommand request, CancellationToken cancellationToken)
        {
            var entity = await _db.LoginAndRegistrationPages.FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);
            if (entity == null)
                return ApiResponse<UpdateLoginAndRegistrationPagesResponse>.Fail("Not found");
            _mapper.Map(request.Request, entity);
            await _db.SaveChangesAsync(cancellationToken);
            await _cache.RemoveAsync($"loginandregistrationpages:{entity.Id}", cancellationToken);
            await _cache.RemoveAsync("loginandregistrationpages:all", cancellationToken);
            _logger.LogInformation($"Updated LoginAndRegistrationPages entity {entity.Id}");
            var resp = _mapper.Map<UpdateLoginAndRegistrationPagesResponse>(entity);
            return ApiResponse<UpdateLoginAndRegistrationPagesResponse>.Ok(resp);
        }
    }
}
