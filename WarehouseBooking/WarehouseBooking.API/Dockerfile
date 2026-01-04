# Use .NET 9 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["WarehouseBooking.API.csproj", "./"]
RUN dotnet restore "WarehouseBooking.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "WarehouseBooking.API.csproj" -c Release -o /app/publish

# Use .NET 9 runtime for running
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port - Render uses PORT env variable
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:${PORT:-10000}

# Start the application
ENTRYPOINT ["dotnet", "WarehouseBooking.API.dll"]
