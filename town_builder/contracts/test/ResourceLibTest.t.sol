// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/game/ResourceLib.sol";
import "../src/game/BuildingLib.sol";

contract ResourceLibTest is Test {
    // Create storage structs for testing
    ResourceLib.Resources resources;
    BuildingLib.Buildings buildings;
    
    // Set up test timestamps
    uint256 startTime = 1000000;
    uint256 timeElapsed = 3600; // 1 hour = 60 minutes
    
    function setUp() public {
        // Initialize with start timestamp
        vm.warp(startTime);
        
        // Initialize resources with default values
        ResourceLib.initializeResources(resources);
        
        // Initialize some buildings for testing
        buildings.townHall = 1;
        buildings.woodHarvester = 2; // Level 2 wood harvester
        buildings.stoneQuarry = 1;   // Level 1 stone quarry
    }
    
    function testInitialResourceValues() public {
        // Check initial values set by initializeResources
        assertEq(resources.wood, 50);
        assertEq(resources.stone, 50);
        assertEq(resources.metal, 25);
        assertEq(resources.food, 50);
        assertEq(resources.storageCapacity, 100);
    }
    
    function testResourceProduction() public {
        // Move forward 60 minutes
        vm.warp(startTime + 3600);
        
        // Calculate current resources
        (uint256 wood, uint256 stone, uint256 metal, uint256 food) = 
            ResourceLib.calculateCurrentResources(resources, buildings, startTime);
        
        // With a level 2 wood harvester + passive rate (1), we expect 3 wood per minute
        // For 60 minutes: 50 initial + (3 * 60) = 50 + 180 = 230
        // But storage cap is 100, so we expect 100 wood
        assertEq(wood, 100, "Wood production calculation is incorrect");
        
        // With a level 1 stone quarry + passive rate (1), we expect 2 stone per minute
        // For 60 minutes: 50 initial + (2 * 60) = 50 + 120 = 170
        // But storage cap is 100, so we expect 100 stone
        assertEq(stone, 100, "Stone production calculation is incorrect");
        
        // Only passive rate for metal (1 per minute)
        // For 60 minutes: 25 initial + (1 * 60) = 25 + 60 = 85
        // Under storage cap, so we expect 85 metal
        assertEq(metal, 85, "Metal production calculation is incorrect");
        
        // Only passive rate for food (1 per minute)
        // For 60 minutes: 50 initial + (1 * 60) = 50 + 60 = 110
        // Over storage cap, so we expect 100 food
        assertEq(food, 100, "Food production calculation is incorrect");
    }
    
    function testResourceSpending() public {
        // First, let's set up some resources
        // Move forward 30 minutes to generate some resources
        vm.warp(startTime + 1800);
        
        // Calculate how many resources we should have after 30 minutes
        (uint256 initialWood, uint256 initialStone, uint256 initialMetal, uint256 initialFood) = 
            ResourceLib.calculateCurrentResources(resources, buildings, startTime);
            
        // Try to spend resources
        bool success = ResourceLib.trySpendResources(
            resources,
            buildings,
            startTime,
            20, // Wood cost
            15, // Stone cost
            10, // Metal cost
            5   // Food cost
        );
        
        // Should succeed as we have enough resources
        assertTrue(success, "Resource spending should succeed");
        
        // Check resource values after spending
        assertEq(resources.wood, initialWood - 20);
        assertEq(resources.stone, initialStone - 15);
        assertEq(resources.metal, initialMetal - 10);
        assertEq(resources.food, initialFood - 5);
    }
    
    function testSpendingNotEnoughResources() public {
        // Try to spend more resources than we have
        bool success = ResourceLib.trySpendResources(
            resources,
            buildings,
            startTime,
            200, // Wood cost (more than our cap)
            15,  // Stone cost
            10,  // Metal cost
            5    // Food cost
        );
        
        // Should fail as we don't have enough wood
        assertFalse(success, "Resource spending should fail");
    }
    
    function testStorageCapacityCalculation() public {
        // Test base capacity for town level 1
        uint256 capacity1 = ResourceLib.calculateStorageCapacity(buildings, 1);
        assertEq(capacity1, 100, "Base storage capacity for level 1 town incorrect");
        
        // Test capacity with storage building
        buildings.storageBuilding = 2; // Level 2 storage building
        uint256 capacityWithStorage = ResourceLib.calculateStorageCapacity(buildings, 1);
        assertEq(capacityWithStorage, 300, "Storage capacity with level 2 storage building incorrect");
        
        // Test capacity with higher town level
        uint256 capacityLevel3 = ResourceLib.calculateStorageCapacity(buildings, 3);
        assertEq(capacityLevel3, 500, "Storage capacity for level 3 town with level 2 storage incorrect");
    }
}