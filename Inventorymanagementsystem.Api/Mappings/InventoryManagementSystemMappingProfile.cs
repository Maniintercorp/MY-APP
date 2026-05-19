using AutoMapper;
using Inventorymanagementsystem.DTOs.InventoryManagementSystem;
using Inventorymanagementsystem.Models;

namespace Inventorymanagementsystem.Mappings;

public class InventoryManagementSystemMappingProfile : Profile
{
    public InventoryManagementSystemMappingProfile()
    {
        CreateMap<InventoryManagementSystemEntity, InventoryManagementSystemResponse>();
        CreateMap<CreateInventoryManagementSystemRequest, InventoryManagementSystemEntity>();
        CreateMap<UpdateInventoryManagementSystemRequest, InventoryManagementSystemEntity>();
    }
}
