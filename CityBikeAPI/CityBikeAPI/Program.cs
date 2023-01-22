using CityBikeAPI.Data;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<ICityBikeRepository, SqlServerCityBikeRepo>();

string myCorsPolicy = "_myAllowedOrigins";
builder.Services.AddCors(options =>
{
    string allowedOrigin = builder.Configuration.GetValue("AllowedOrigin", "")!;
    options.AddPolicy(name: myCorsPolicy,
        builder =>
        {
            builder.WithOrigins(allowedOrigin)
            .WithMethods("GET", "OPTIONS")
            .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Logging.ClearProviders();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(myCorsPolicy);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

