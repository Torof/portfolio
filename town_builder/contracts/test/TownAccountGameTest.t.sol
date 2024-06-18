// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/accounts/TownAccountGame.sol";
import "../src/game/ResourceLib.sol";
import "../src/game/BuildingLib.sol";

// Test contract for TownAccountGame
contract TownAccountGameTest is Test {
    TownAccountGame public townAccount;
    address public townManager = address(2);
    
    // Set up test timestamp
    uint256 startTime = 1000000;
    
    function setUp() public {
        // Initialize with start timestamp
        vm.warp(startTime);
        
        // Deploy TownAccountGame 
        townAccount = new TownAccountGame(townManager);
    }
    
    function testInitialization() public {
        // Check initial values
        assertEq(townAccount.townLevel(), 1);
        assertEq(townAccount.lastResourceUpdate(), startTime);
        
        // Check town hall initialized
        assertEq(townAccount.getBuildingLevel(BuildingLib.BUILDING_TOWN_HALL), 1);
        
        // Check initial resources
        (uint256 wood, uint256 stone, uint256 metal, uint256 food) = townAccount.getResources();
        assertEq(wood, 50);
        assertEq(stone, 50);
        assertEq(metal, 25);
        assertEq(food, 50);
        
        // Check storage capacity
        assertEq(townAccount.getStorageCapacity(), 100);
    }
    
    function testResourceAccumulation() public {
        // Move forward 1 hour
        vm.warp(startTime + 3600);
        
        // Check resources accumulated
        (uint256 wood, uint256 stone, uint256 metal, uint256 food) = townAccount.getResources();
        
        // With passive rate of 1 per minute, for 60 minutes
        // Some resources potentially capped at 100 due to storage limit
        assertEq(wood, 100); // 50 + 60 = 110, capped at 100
        assertEq(stone, 100); // 50 + 60 = 110, capped at 100
        assertEq(metal, 85);  // 25 + 60 = 85, under cap
        assertEq(food, 100);  // 50 + 60 = 110, capped at 100
    }
    
    function testTownManagerFunctionality() public {
        // Town manager can execute admin functions
        vm.startPrank(townManager);
        
        // Mock a simple call that returns some data
        address target = address(this);
        bytes memory data = abi.encodeWithSignature("mockFunction()");
        bytes memory result = townAccount.adminExecute(target, 0, data);
        
        // Verify the call worked (we'll just check that it returned our expected data)
        assertEq(result, abi.encode(uint256(42)));
        
        vm.stopPrank();
    }
    
    // Mock function for testing adminExecute
    function mockFunction() external pure returns (uint256) {
        return 42;
    }
}