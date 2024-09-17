using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Data;
using System.Fabric.Query;
using System.Net.Http;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.FileProviders;

namespace API_gateway
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance.
    /// </summary>
    internal sealed class API_gateway : Microsoft.ServiceFabric.Services.Runtime.StatelessService
    {
        private readonly HttpClient _httpClient;
        private readonly Uri _userManagementServiceUri;
        private readonly Uri _rideManagementServiceUri;
        private readonly Uri _raitingManagementServiceUri;
        private readonly Uri _raitingStatelessManagementServiceUri;

        public API_gateway(StatelessServiceContext context)
            : base(context)
        {
            _userManagementServiceUri = new Uri("fabric:/BasVasTaxi-back/UserStateful");
            _rideManagementServiceUri = new Uri("fabric:/BasVasTaxi-back/RideStateful");
            _raitingManagementServiceUri = new Uri("fabric:/BasVasTaxi-back/RaitingStateful");
            _raitingStatelessManagementServiceUri = new Uri("fabric:/BasVasTaxi-back/RaitingStateless");
            _httpClient = new HttpClient();
        }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");
                        var builder = WebApplication.CreateBuilder();

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen(opt =>
                        {
                            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                            {
                                Name = "Authorization",
                                Type = SecuritySchemeType.ApiKey,
                                Scheme = "Bearer",
                                BearerFormat = "JWT",
                                In = ParameterLocation.Header
                            });

                            opt.AddSecurityRequirement(new OpenApiSecurityRequirement
                            {
                                {
                                    new OpenApiSecurityScheme
                                    {
                                        Reference = new OpenApiReference
                                        {
                                            Type = ReferenceType.SecurityScheme,
                                            Id = "Bearer"
                                        }
                                    }, Array.Empty<string>()
                                }
                            });
                        });

                        builder.Services.AddAuthentication(options =>
                        {
                            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                        }).AddJwtBearer(options =>
                        {
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidateAudience = true,
                                ValidateIssuerSigningKey = true,
                                ValidateLifetime = true,
                                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                                ValidAudience = builder.Configuration["Jwt:Audience"],
                                IssuerSigningKey = new SymmetricSecurityKey
                                    (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
                                RoleClaimType = ClaimTypes.Role
                            };
                        });
                        var app = builder.Build();
                        if (app.Environment.IsDevelopment())
                        {
                        app.UseSwagger();
                        app.UseSwaggerUI();
                        }
                        app.UseStaticFiles();
                        app.UseStaticFiles(new StaticFileOptions()
                        {
                            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"static/")),
                            RequestPath = new PathString("/static")
                        });
                        app.UseCors(config =>
                        {
                            config.AllowAnyHeader();
                            config.AllowAnyMethod();
                            config.AllowAnyOrigin();
                        });
                        app.UseAuthorization();
                        app.MapControllers();
                        
                        return app;

                    }))
            };
        }
    }
}
