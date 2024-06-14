// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BuildingLib.sol";

/**
 * @title ResourceLib
 * @dev Library for resource management in Town Builder
 * Handles resource production, storage limits, and spending
 */
library ResourceLib {
    // Resource structure
    struct Resources {
        uint256 wood;
        uint256 stone;
        uint256 metal;
        uint256 food;
        uint256 storageCapacity;
    }
    
    // Base production rates no longer needed since we directly use building levels
    // uint256 internal constant BASE_PRODUCTION_RATE = 1;
    
    // Base storage capacity
    uint256 internal constant BASE_STORAGE_CAPACITY = 100;
    
    // Resource types (for use in external functions)
    uint8 internal constant RESOURCE_WOOD = 0;
    uint8 internal constant RESOURCE_STONE = 1;
    uint8 internal constant RESOURCE_METAL = 2;
    uint8 internal constant RESOURCE_FOOD = 3;
    
    /**
     * @dev Initialize resources for a new town
     * @param resources The resources storage struct
     */
    function initializeResources(Resources storage resources) internal {
        resources.wood = 50;
        resources.stone = 50;
        resources.metal = 25;
        resources.food = 50;
        resources.storageCapacity = BASE_STORAGE_CAPACITY;
    }
    
    /**
     * @dev Calculate current resource values considering storage limits
     * @param resources The resources storage struct
     * @param buildings The buildings storage struct (for production rates)
     * @param lastUpdateTime Timestamp of last resource update
     * @return Current amounts of wood, stone, metal, food
     */
    function calculateCurrentResources(
        Resources storage resources,
        BuildingLib.Buildings storage buildings,
        uint256 lastUpdateTime
    ) internal view returns (uint256, uint256, uint256, uint256) {
        // Calculate minutes elapsed since last update
        uint256 minutesElapsed = (block.timestamp - lastUpdateTime) / 60;
        
        // Calculate production rates based on buildings
        (uint256 woodRate, uint256 stoneRate, uint256 metalRate, uint256 foodRate) = 
            getProductionRates(buildings);
        
        // Calculate produced resources (cap at storage limit)
        uint256 woodProduced = woodRate * minutesElapsed;
        uint256 stoneProduced = stoneRate * minutesElapsed;
        uint256 metalProduced = metalRate * minutesElapsed;
        uint256 foodProduced = foodRate * minutesElapsed;
        
        // Apply storage limits
        uint256 currentWood = min(resources.wood + woodProduced, resources.storageCapacity);
        uint256 currentStone = min(resources.stone + stoneProduced, resources.storageCapacity);
        uint256 currentMetal = min(resources.metal + metalProduced, resources.storageCapacity);
        uint256 currentFood = min(resources.food + foodProduced, resources.storageCapacity);
        
        return (currentWood, currentStone, currentMetal, currentFood);
    }
    
    /**
     * @dev Check if enough resources are available and spend them if true
     * @param resources The resources storage struct
     * @param buildings The buildings storage struct
     * @param lastUpdateTime Timestamp of last resource update
     * @param woodCost Wood cost
     * @param stoneCost Stone cost
     * @param metalCost Metal cost
     * @param foodCost Food cost
     * @return success Whether the resources were successfully spent
     */
    function trySpendResources(
        Resources storage resources,
        BuildingLib.Buildings storage buildings,
        uint256 lastUpdateTime,
        uint256 woodCost,
        uint256 stoneCost,
        uint256 metalCost,
        uint256 foodCost
    ) internal returns (bool success) {
        // Calculate current resources
        (uint256 currentWood, uint256 currentStone, uint256 currentMetal, uint256 currentFood) = 
            calculateCurrentResources(resources, buildings, lastUpdateTime);
        
        // Check if enough resources
        if (currentWood < woodCost || 
            currentStone < stoneCost || 
            currentMetal < metalCost || 
            currentFood < foodCost) {
            return false;
        }
        
        // Update resources with spent amounts
        resources.wood = currentWood - woodCost;
        resources.stone = currentStone - stoneCost;
        resources.metal = currentMetal - metalCost;
        resources.food = currentFood - foodCost;
        
        return true;
    }
    
    /**
     * @dev Get production rates based on buildings
     * @param buildings The buildings storage struct
     * @return Production rates for wood, stone, metal, food
     */
    function getProductionRates(BuildingLib.Buildings storage buildings) 
        internal view returns (uint256, uint256, uint256, uint256) 
    {
        // Base passive production rate (even with no buildings)
        uint256 passiveRate = 1; // 1 unit per minute passive rate
        
        // Wood production from Wood Harvesters plus passive rate
        uint256 woodRate = buildings.woodHarvester + passiveRate;
            
        // Stone production from Stone Quarries plus passive rate
        uint256 stoneRate = buildings.stoneQuarry + passiveRate;
            
        // Metal production from Metal Mines plus passive rate
        uint256 metalRate = buildings.metalMine + passiveRate;
            
        // Food production from Farms plus passive rate
        uint256 foodRate = buildings.farm + passiveRate;
            
        return (woodRate, stoneRate, metalRate, foodRate);
    }
    
    /**
     * @dev Calculate storage capacity based on town level and storage buildings
     * @param buildings The buildings storage struct
     * @param townLevel Current town level
     * @return Total storage capacity
     */
    function calculateStorageCapacity(
        BuildingLib.Buildings storage buildings,
        uint8 townLevel
    ) internal view returns (uint256) {
        // Base capacity based on town level
        uint256 baseCapacity = BASE_STORAGE_CAPACITY * townLevel;
        
        // Additional capacity from Storage buildings
        uint256 storageBonus = buildings.storageBuilding * 100;
        
        return baseCapacity + storageBonus;
    }
    
    /**
     * @dev Update storage capacity
     * @param resources The resources storage struct
     * @param buildings The buildings storage struct
     * @param townLevel Current town level
     */
    function updateStorageCapacity(
        Resources storage resources,
        BuildingLib.Buildings storage buildings,
        uint8 townLevel
    ) internal {
        resources.storageCapacity = calculateStorageCapacity(buildings, townLevel);
    }
    
    /**
     * @dev Helper function to return the minimum of two values
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}