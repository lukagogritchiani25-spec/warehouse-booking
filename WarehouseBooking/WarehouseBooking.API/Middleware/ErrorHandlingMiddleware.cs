using System.Net;
using System.Text.Json;
using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var result = string.Empty;

            switch (exception)
            {
                case ArgumentException:
                    code = HttpStatusCode.BadRequest;
                    break;
                case UnauthorizedAccessException:
                    code = HttpStatusCode.Unauthorized;
                    break;
                case KeyNotFoundException:
                    code = HttpStatusCode.NotFound;
                    break;
            }

            var response = ApiResponse<object>.FailureResponse(
                exception.Message,
                new List<string> { exception.StackTrace ?? string.Empty }
            );

            result = JsonSerializer.Serialize(response);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(result);
        }
    }
}
