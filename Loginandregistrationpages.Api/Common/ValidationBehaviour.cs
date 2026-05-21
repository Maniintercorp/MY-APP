using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Loginandregistrationpages.Api.Common
{
    public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;
        public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (_validators.Any())
            {
                var context = new ValidationContext<TRequest>(request);
                var validationResults = await Task.WhenAll(
                    _validators.Select(v => v.ValidateAsync(context, cancellationToken)));
                var failures = validationResults.SelectMany(r => r.Errors).Where(f => f != null).ToList();
                if (failures.Any())
                {
                    var errors = string.Join("; ", failures.Select(x => x.ErrorMessage));
                    var apiResponseType = typeof(TResponse).IsGenericType ? typeof(TResponse).GetGenericArguments().FirstOrDefault() : null;
                    var errorResponse = apiResponseType != null
                        ? Activator.CreateInstance(typeof(ApiResponse<>).MakeGenericType(apiResponseType))
                        : Activator.CreateInstance(typeof(ApiResponse<object>));
                    var response = errorResponse?.GetType().GetMethod("Fail")!.Invoke(errorResponse, new object[] { errors });
                    return (TResponse)response!;
                }
            }
            return await next();
        }
    }
}
