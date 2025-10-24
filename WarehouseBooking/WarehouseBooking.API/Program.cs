using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using WarehouseBooking.API.Data;
using WarehouseBooking.API.Middleware;
using WarehouseBooking.API.Services;

// Clear default claim type mappings to preserve original claim types
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// Get connection string - prioritize DATABASE_URL for Docker/Render compatibility
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? string.Empty;

Console.WriteLine($"=== DEBUG: Connection String Check ===");
Console.WriteLine($"DATABASE_URL exists: {!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL"))}");
Console.WriteLine($"ConnectionStrings__DefaultConnection exists: {!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection"))}");
Console.WriteLine($"Config DefaultConnection exists: {!string.IsNullOrEmpty(builder.Configuration.GetConnectionString("DefaultConnection"))}");
Console.WriteLine($"Final connection string length: {connectionString.Length}");
Console.WriteLine($"Connection string (first 30 chars): {(connectionString.Length > 30 ? connectionString.Substring(0, 30) : connectionString)}");
Console.WriteLine($"Connection string (last 20 chars): {(connectionString.Length > 20 ? connectionString.Substring(connectionString.Length - 20) : connectionString)}");
Console.WriteLine($"=====================================");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string not found. Set DATABASE_URL environment variable.");
}

// Add DbContext with the resolved connection string
// Use a lambda to ensure the connection string is properly captured
var dbConnectionString = connectionString; // Capture in closure
Console.WriteLine($"CAPTURED connection string for DbContext: {dbConnectionString}");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    Console.WriteLine($"DbContext being created, about to call UseNpgsql with: {dbConnectionString}");
    options.UseNpgsql(dbConnectionString);
});

// Add JWT Authentication with fallback to direct env vars
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"]
    ?? Environment.GetEnvironmentVariable("JwtSettings__Secret")
    ?? throw new InvalidOperationException("JWT Secret not found");
var issuer = jwtSettings["Issuer"]
    ?? Environment.GetEnvironmentVariable("JwtSettings__Issuer")
    ?? "WarehouseBookingAPI";
var audience = jwtSettings["Audience"]
    ?? Environment.GetEnvironmentVariable("JwtSettings__Audience")
    ?? "WarehouseBookingClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Add Controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Warehouse Booking API",
        Version = "v1",
        Description = "API for managing warehouse bookings"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warehouse Booking API v1");
    });
}

// Add global error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
