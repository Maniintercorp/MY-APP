using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Queries.LoginAndRegistrationPages
{
    public class GetLoginAndRegistrationPagesByIdQuery : IRequest<ApiResponse<GetLoginAndRegistrationPagesByIdResponse>>
    {
        public Guid Id { get; }
        public GetLoginAndRegistrationPagesByIdQuery(Guid id) => Id = id;
    }
    public class GetLoginAndRegistrationPagesByIdQueryHandler : IRequestHandler<GetLoginAndRegistrationPagesByIdQuery, ApiResponse<GetLoginAndRegistrationPagesByIdResponse>>
    {
        private readonly AppDbContext _db;
        private readonly ICacheService _cache;
        private readonly ILogger<GetLoginAndRegistrationPagesByIdQueryHandler> _logger;
        private readonly IMapper _mapper;
        public GetLoginAndRegistrationPagesByIdQueryHandler(AppDbContext db, ICacheService cache, ILogger<GetLoginAndRegistrationPagesByIdQueryHandler> logger, IMapper mapper)
        {
            _db = db;
            _cache = cache;
            _logger = logger;
            _mapper = mapper;
        }
        public async Task<ApiResponse<GetLoginAndRegistrationPagesByIdResponse>> Handle(GetLoginAndRegistrationPagesByIdQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = $"loginandregistrationpages:{request.Id}";
            var cached = await _cache.GetAsync<GetLoginAndRegistrationPagesByIdResponse>(cacheKey, cancellationToken);
            if (cached != null)
            {
                return ApiResponse<GetLoginAndRegistrationPagesByIdResponse>.Ok(cached);
            }
            var entity = await _db.LoginAndRegistrationPages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (entity == null)
                return ApiResponse<GetLoginAndRegistrationPagesByIdResponse>.Fail("Not found");
            var mapped = _mapper.Map<GetLoginAndRegistrationPagesByIdResponse>(entity);
            await _cache.SetAsync(cacheKey, mapped, null, cancellationToken);
            return ApiResponse<GetLoginAndRegistrationPagesByIdResponse>.Ok(mapped);
        }
    }
}
