using Loginandregistrationpages.Api.Common;
using Loginandregistrationpages.Api.DTOs.LoginAndRegistrationPages;
using Loginandregistrationpages.Api.Models;
using Loginandregistrationpages.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Queries.LoginAndRegistrationPages
{
    public class GetAllLoginAndRegistrationPagessQuery : IRequest<ApiResponse<GetAllLoginAndRegistrationPagesResponse>> { }

    public class GetAllLoginAndRegistrationPagessQueryHandler : IRequestHandler<GetAllLoginAndRegistrationPagessQuery, ApiResponse<GetAllLoginAndRegistrationPagesResponse>>
    {
        private readonly AppDbContext _db;
        private readonly ICacheService _cache;
        private readonly ILogger<GetAllLoginAndRegistrationPagessQueryHandler> _logger;
        private readonly IMapper _mapper;
        public GetAllLoginAndRegistrationPagessQueryHandler(AppDbContext db, ICacheService cache, ILogger<GetAllLoginAndRegistrationPagessQueryHandler> logger, IMapper mapper)
        {
            _db = db;
            _cache = cache;
            _logger = logger;
            _mapper = mapper;
        }
        public async Task<ApiResponse<GetAllLoginAndRegistrationPagesResponse>> Handle(GetAllLoginAndRegistrationPagessQuery request, CancellationToken cancellationToken)
        {
            const string cacheKey = "loginandregistrationpages:all";
            var cached = await _cache.GetAsync<GetAllLoginAndRegistrationPagesResponse>(cacheKey, cancellationToken);
            if (cached != null)
            {
                _logger.LogInformation("Returning LoginAndRegistrationPages from cache");
                return ApiResponse<GetAllLoginAndRegistrationPagesResponse>.Ok(cached);
            }
            var items = await _db.LoginAndRegistrationPages.AsNoTracking().ToListAsync(cancellationToken);
            var mapped = new GetAllLoginAndRegistrationPagesResponse { Items = _mapper.Map<List<GetLoginAndRegistrationPagesByIdResponse>>(items) };
            await _cache.SetAsync(cacheKey, mapped, null, cancellationToken);
            return ApiResponse<GetAllLoginAndRegistrationPagesResponse>.Ok(mapped);
        }
    }
}
