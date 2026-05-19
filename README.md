# Inventorymanagementsystem

.NET 8 Web API generated with EF Core 8, CQRS/MediatR, JWT Bearer authentication, FluentValidation, AutoMapper, Redis caching, Serilog, Swagger, health checks, and rate limiting.

## Prerequisites

- .NET 8 SDK
- SQL Server
- Redis running at `localhost:6379`

## Run

```bash
dotnet restore
dotnet ef database update --project Inventorymanagementsystem.Api
dotnet run --project Inventorymanagementsystem.Api
```

## Health Checks

```http
GET /health
GET /health/live
```

## Swagger

Open `/swagger` in development. Use the JWT Bearer authorize button after registering or logging in.

## Notes

The placeholder JWT key and SQL Server password in `appsettings.json` must be replaced before production use.
