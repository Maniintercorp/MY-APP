# Loginandregistrationpages

## Getting Started

1. **Restore dependencies**:
    ```sh
    dotnet restore
    ```
2. **Apply database migrations**:
    ```sh
    dotnet ef database update --project Loginandregistrationpages.Api
    ```
3. **Run the API**:
    ```sh
    dotnet run --project Loginandregistrationpages.Api
    ```

- Health check: GET http://localhost:5000/health

## Auth API contracts

### Register
```
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string"
  },
  "message": "Registration successful"
}
```

### Login
```
POST /api/auth/login
{
  "usernameOrEmail": "string",
  "password": "string"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "string",
    "userId": "string",
    "username": "string",
    "email": "string"
  },
  "message": "Login successful"
}
```


## Notes
- Update appsettings.json (JwtSettings, connection strings) for production.
- Redis required for caching (see appsettings.json).
