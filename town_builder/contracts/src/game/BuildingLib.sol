// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ResourceLib.sol";

/**
 * @title BuildingLib
 * @dev Library for building management in Town Builder
 */
library BuildingLib {
    // Building structure
    struct Buildings {
        uint8 townHall;
        uint8 woodHarvester;
        uint8 stoneQuarry;
        uint8 metalMine;
        uint8 farm;
        uint8 storageBuilding;
        uint8 market;
    }
    
    // Town level constants
    uint8 public constant MAX_TOWN_LEVEL = 5;
    
    // Building type constants (for external references)
    uint8 public constant BUILDING_TOWN_HALL = 0;
    uint8 public constant BUILDING_WOOD_HARVESTER = 1;
    uint8 public constant BUILDING_STONE_QUARRY = 2;
    uint8 public constant BUILDING_METAL_MINE = 3;
    uint8 public constant BUILDING_FARM = 4;
    uint8 public constant BUILDING_STORAGE = 5;
    uint8 public constant BUILDING_MARKET = 6;
    
    // Maximum building level
    uint8 public constant MAX_BUILDING_LEVEL = 5;
    
    // Custom errors
    error InvalidBuildingType();
    error BuildingAlreadyMaxLevel();
    error MaxBuildingsReached();
    error TownLevelTooLow();
    
    // Removed getMaxBuildings as we're only allowing one of each building type
    
    /**
     * @dev Check if a building can be constructed or upgraded
     * @param buildings The buildings storage struct
     * @param buildingType The type of building to check
     * @return Whether the building can be constructed or upgraded
     */
    function canConstructBuilding(
        Buildings storage buildings,
        uint8 buildingType
    ) internal view returns (bool) {
        // Check for valid building type
        if (buildingType > BUILDING_MARKET) {
            return false;
        }
        
        // Get current level of the building
        uint8 currentLevel = getBuildingLevel(buildings, buildingType);
        
        // Check if already at max level
        if (currentLevel >= MAX_BUILDING_LEVEL) {
            return false;
        }
        
        // Town Hall level limits other buildings
        if (buildingType != BUILDING_TOWN_HALL && currentLevel >= buildings.townHall) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Get the current level of a building
     * @param buildings The buildings storage struct
     * @param buildingType The type of building to check
     * @return The current level of the building
     */
    function getBuildingLevel(
        Buildings storage buildings,
        uint8 buildingType
    ) internal view returns (uint8) {
        if (buildingType == BUILDING_TOWN_HALL) return buildings.townHall;
        if (buildingType == BUILDING_WOOD_HARVESTER) return buildings.woodHarvester;
        if (buildingType == BUILDING_STONE_QUARRY) return buildings.stoneQuarry;
        if (buildingType == BUILDING_METAL_MINE) return buildings.metalMine;
        if (buildingType == BUILDING_FARM) return buildings.farm;
        if (buildingType == BUILDING_STORAGE) return buildings.storageBuilding;
        if (buildingType == BUILDING_MARKET) return buildings.market;
        
        revert InvalidBuildingType();
    }
    
    /**
     * @dev Upgrade a building by exactly 1 level
     * @param buildings The buildings storage struct
     * @param buildingType The type of building to upgrade
     */
    function upgradeBuilding(
        Buildings storage buildings,
        uint8 buildingType
    ) internal {
        // Check for valid building type
        if (buildingType > BUILDING_MARKET) revert InvalidBuildingType();
        
        // Directly upgrade the appropriate building
        if (buildingType == BUILDING_TOWN_HALL) {
            buildings.townHall += 1;
        } else if (buildingType == BUILDING_WOOD_HARVESTER) {
            buildings.woodHarvester += 1;
        } else if (buildingType == BUILDING_STONE_QUARRY) {
            buildings.stoneQuarry += 1;
        } else if (buildingType == BUILDING_METAL_MINE) {
            buildings.metalMine += 1;
        } else if (buildingType == BUILDING_FARM) {
            buildings.farm += 1;
        } else if (buildingType == BUILDING_STORAGE) {
            buildings.storageBuilding += 1;
        } else if (buildingType == BUILDING_MARKET) {
            buildings.market += 1;
        }
    }
    
    /**
     * @dev Get building costs
     * @param buildingType The type of building to check
     * @param nextLevel The level after the upgrade
     * @return woodCost, stoneCost, metalCost, foodCost
     */
    function getBuildingCost(
        uint8 buildingType,
        uint8 nextLevel
    ) internal pure returns (uint256, uint256, uint256, uint256) {
        // Base costs
        uint256 baseWood = 30;
        uint256 baseStone = 30;
        uint256 baseMetal = 15;
        uint256 baseFood = 20;
        
        // Adjust base costs based on building type
        if (buildingType == BUILDING_TOWN_HALL) {
            baseWood = 50;
            baseStone = 50;
            baseMetal = 25;
            baseFood = 30;
        } else if (buildingType == BUILDING_WOOD_HARVESTER) {
            baseWood = 20;
            baseStone = 30;
            baseMetal = 10;
            baseFood = 15;
        } else if (buildingType == BUILDING_STONE_QUARRY) {
            baseWood = 30;
            baseStone = 20;
            baseMetal = 10;
            baseFood = 15;
        } else if (buildingType == BUILDING_METAL_MINE) {
            baseWood = 30;
            baseStone = 30;
            baseMetal = 5;
            baseFood = 20;
        } else if (buildingType == BUILDING_FARM) {
            baseWood = 25;
            baseStone = 20;
            baseMetal = 10;
            baseFood = 10;
        } else if (buildingType == BUILDING_STORAGE) {
            baseWood = 40;
            baseStone = 40;
            baseMetal = 20;
            baseFood = 15;
        } else if (buildingType == BUILDING_MARKET) {
            baseWood = 35;
            baseStone = 35;
            baseMetal = 20;
            baseFood = 25;
        } else {
            revert InvalidBuildingType();
        }
        
        // Scale costs by level
        uint256 levelMultiplier = nextLevel * 2 - 1; // Level 1: 1x, Level 2: 3x, Level 3: 5x, etc.
        
        return (
            baseWood * levelMultiplier,
            baseStone * levelMultiplier,
            baseMetal * levelMultiplier,
            baseFood * levelMultiplier
        );
    }
    
    /**
     * @dev Get town upgrade costs
     * @param currentLevel The current level of the town
     * @return woodCost, stoneCost, metalCost, foodCost
     */
    function getTownUpgradeCost(
        uint8 currentLevel
    ) internal pure returns (uint256, uint256, uint256, uint256) {
        // Base cost for upgrading from level 1 to 2
        uint256 baseCost = 50;
        
        // Cost increases for each level
        uint256 costMultiplier = 2 ** (currentLevel - 1);
        uint256 levelCost = baseCost * costMultiplier;
        
        return (levelCost, levelCost, levelCost, levelCost);
    }
    
    /**
     * @dev Try to construct or upgrade a building
     * @param resources The resources storage struct
     * @param buildings The buildings storage struct
     * @param lastUpdateTime Timestamp of last resource update
     * @param buildingType The type of building to construct
     * @param townLevel The town's current level
     * @return Whether the building was successfully constructed or upgraded
     */
    function tryConstructBuilding(
        ResourceLib.Resources storage resources,
        Buildings storage buildings,
        uint256 lastUpdateTime,
        uint8 buildingType,
        uint8 townLevel
    ) internal returns (bool) {
        // Check if building can be constructed
        if (!canConstructBuilding(buildings, buildingType)) {
            return false;
        }
        
        // Get current level of the building
        uint8 currentLevel = getBuildingLevel(buildings, buildingType);
        uint8 nextLevel = currentLevel + 1;
        
        // Get cost for upgrading to the next level
        (uint256 woodCost, uint256 stoneCost, uint256 metalCost, uint256 foodCost) = 
            getBuildingCost(buildingType, nextLevel);
        
        // Try to spend resources
        bool success = ResourceLib.trySpendResources(
            resources,
            buildings,
            lastUpdateTime,
            woodCost,
            stoneCost,
            metalCost,
            foodCost
        );
        
        if (!success) {
            return false;
        }
        
        // Upgrade the building
        upgradeBuilding(buildings, buildingType);
        
        // If this is a storage building, update storage capacity
        if (buildingType == BUILDING_STORAGE) {
            ResourceLib.updateStorageCapacity(resources, buildings, townLevel);
        }
        
        return true;
    }
}