using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Data;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Loginandregistrationpages.Api.Commands.LoginAndRegistrationPages
{
    public class DeleteLoginAndRegistrationPagesCommand : IRequest<ApiResponse<string>>
    {
        public Guid Id { get; }
        public DeleteLoginAndRegistrationPagesCommand(Guid id) => Id = id;
    }
    public class DeleteLoginAndRegistrationPagesCommandHandler : IRequestHandler<DeleteLoginAndRegistrationPagesCommand, ApiResponse<string>>
    {
        private readonly AppDbContext _db;
        private readonly ILogger<DeleteLoginAndRegistrationPagesCommandHandler> _logger;
        private readonly ICacheService _cache;
        public DeleteLoginAndRegistrationPagesCommandHandler(AppDbContext db, ILogger<DeleteLoginAndRegistrationPagesCommandHandler> logger, ICacheService cache)
        {
            _db = db;
            _logger = logger;
            _cache = cache;
        }
        public async Task<ApiResponse<string>> Handle(DeleteLoginAndRegistrationPagesCommand request, CancellationToken cancellationToken)
        {
            var entity = await _db.LoginAndRegistrationPages.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (entity == null)
                return ApiResponse<string>.Fail("Not found");
            entity.IsDeleted = true;
            await _db.SaveChangesAsync(cancellationToken);
            await _cache.RemoveAsync($"loginandregistrationpages:{entity.Id}", cancellationToken);
            await _cache.RemoveAsync("loginandregistrationpages:all", cancellationToken);
            _logger.LogInformation($"Soft deleted LoginAndRegistrationPages entity {entity.Id}");
            return ApiResponse<string>.Ok(entity.Id.ToString(), "Deleted");
        }
    }
}
