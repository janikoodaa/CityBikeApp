using CityBikeAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<ICityBikeRepository, SqlServerCityBikeRepo>();

builder.Services.AddCors(options =>
{
    string allowedOrigin = builder.Configuration.GetValue("AllowedOrigin", "")!;
    options.AddPolicy(name: "_myAllowedOrigins",
        builder =>
        {
            builder.WithOrigins(allowedOrigin)
            .WithMethods("GET")
            .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

