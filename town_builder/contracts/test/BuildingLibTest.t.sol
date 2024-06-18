// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/game/BuildingLib.sol";
import "../src/game/ResourceLib.sol";

contract BuildingLibTest is Test {
    // Create storage structs for testing
    BuildingLib.Buildings buildings;
    ResourceLib.Resources resources;
    
    // Set up test timestamp
    uint256 startTime = 1000000;
    
    function setUp() public {
        // Initialize with start timestamp
        vm.warp(startTime);
        
        // Initialize resources with default values
        ResourceLib.initializeResources(resources);
        
        // Initialize town hall at level 1
        buildings.townHall = 1;
    }
    
    function testGetBuildingLevel() public {
        // Check town hall level
        assertEq(BuildingLib.getBuildingLevel(buildings, BuildingLib.BUILDING_TOWN_HALL), 1);
        
        // Check unbuilt buildings
        assertEq(BuildingLib.getBuildingLevel(buildings, BuildingLib.BUILDING_WOOD_HARVESTER), 0);
        assertEq(BuildingLib.getBuildingLevel(buildings, BuildingLib.BUILDING_STONE_QUARRY), 0);
    }
    
    function testUpgradeBuilding() public {
        // Test upgrading wood harvester from 0 to 1
        BuildingLib.upgradeBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER);
        assertEq(buildings.woodHarvester, 1);
        
        // Test upgrading it again to level 2
        BuildingLib.upgradeBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER);
        assertEq(buildings.woodHarvester, 2);
    }
    
    function testCanConstructBuilding() public {
    // Should be able to construct a new building
    assertTrue(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
    
    // Upgrade wood harvester to level 1
    buildings.woodHarvester = 1;
    
    // Should be able to upgrade it to level 2 (townHall is level 1)
    // But the actual implementation restricts this - buildings can't exceed town hall level
    // Let's test what the implementation actually does
    assertFalse(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
    
    // Upgrade town hall to level 2
    buildings.townHall = 2;
    
    // Now should be able to upgrade wood harvester again
    assertTrue(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
    
    // Upgrade to level 2
    buildings.woodHarvester = 2;
    
    // Should NOT be able to upgrade beyond town hall level
    assertFalse(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
    
    // Test max level check
    buildings.townHall = BuildingLib.MAX_BUILDING_LEVEL;
    buildings.woodHarvester = BuildingLib.MAX_BUILDING_LEVEL - 1;
    
    // Can upgrade to max level
    assertTrue(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
    
    // Set to max level
    buildings.woodHarvester = BuildingLib.MAX_BUILDING_LEVEL;
    
    // Should NOT be able to upgrade beyond max level
    assertFalse(BuildingLib.canConstructBuilding(buildings, BuildingLib.BUILDING_WOOD_HARVESTER));
}
    
    function testBuildingCosts() public {
        // Get cost for a level 1 wood harvester
        (uint256 woodCost, uint256 stoneCost, uint256 metalCost, uint256 foodCost) = 
            BuildingLib.getBuildingCost(BuildingLib.BUILDING_WOOD_HARVESTER, 1);
            
        // Verify costs match expected values
        assertEq(woodCost, 20);
        assertEq(stoneCost, 30);
        assertEq(metalCost, 10);
        assertEq(foodCost, 15);
        
        // Get cost for a level 2 wood harvester (should be higher)
        (woodCost, stoneCost, metalCost, foodCost) = 
            BuildingLib.getBuildingCost(BuildingLib.BUILDING_WOOD_HARVESTER, 2);
            
        // Level 2 costs should be 3x level 1 costs
        assertEq(woodCost, 20 * 3);
        assertEq(stoneCost, 30 * 3);
        assertEq(metalCost, 10 * 3);
        assertEq(foodCost, 15 * 3);
    }
    
    function testTryConstructBuilding() public {
        // First, ensure we have enough resources for level 1 wood harvester
        // Move ahead 30 minutes to generate resources
        vm.warp(startTime + 1800);
        
        // Try to construct a wood harvester
        bool success = BuildingLib.tryConstructBuilding(
            resources,
            buildings,
            startTime,
            BuildingLib.BUILDING_WOOD_HARVESTER,
            1 // Town level
        );
        
        // Should succeed
        assertTrue(success);
        
        // Verify building was constructed
        assertEq(buildings.woodHarvester, 1);
        
        // Resources should be reduced by the building cost
        (uint256 woodCost, uint256 stoneCost, uint256 metalCost, uint256 foodCost) = 
            BuildingLib.getBuildingCost(BuildingLib.BUILDING_WOOD_HARVESTER, 1);
            
        // Calculate expected resources after 30 minutes and spending
        uint256 expectedWood = 50 + (1 * 30) - woodCost; // Initial + production - cost
        uint256 expectedStone = 50 + (1 * 30) - stoneCost;
        uint256 expectedMetal = 25 + (1 * 30) - metalCost;
        uint256 expectedFood = 50 + (1 * 30) - foodCost;
        
        assertEq(resources.wood, expectedWood);
        assertEq(resources.stone, expectedStone);
        assertEq(resources.metal, expectedMetal);
        assertEq(resources.food, expectedFood);
    }
    
    function testStorageBuildingUpdatesCapacity() public {
        // Get initial storage capacity
        uint256 initialCapacity = resources.storageCapacity;
        
        // Create initial storage building
        buildings.storageBuilding = 0;
        
        // Move ahead 60 minutes to generate resources
        vm.warp(startTime + 3600);
        
        // Try to construct a storage building
        bool success = BuildingLib.tryConstructBuilding(
            resources,
            buildings,
            startTime,
            BuildingLib.BUILDING_STORAGE,
            1 // Town level
        );
        
        // Should succeed
        assertTrue(success);
        
        // Verify storage building was constructed
        assertEq(buildings.storageBuilding, 1);
        
        // Verify storage capacity was updated
        assertEq(resources.storageCapacity, initialCapacity + 100);
    }
    
    function testTownUpgradeCost() public {
        // Get cost for upgrading from level 1 to 2
        (uint256 woodCost, uint256 stoneCost, uint256 metalCost, uint256 foodCost) = 
            BuildingLib.getTownUpgradeCost(1);
            
        // Verify costs match expected values
        assertEq(woodCost, 50);
        assertEq(stoneCost, 50);
        assertEq(metalCost, 50);
        assertEq(foodCost, 50);
        
        // Get cost for upgrading from level 2 to 3
        (woodCost, stoneCost, metalCost, foodCost) = 
            BuildingLib.getTownUpgradeCost(2);
            
        // Level 3 costs should be 2x level 2 costs
        assertEq(woodCost, 100);
        assertEq(stoneCost, 100);
        assertEq(metalCost, 100);
        assertEq(foodCost, 100);
    }
}