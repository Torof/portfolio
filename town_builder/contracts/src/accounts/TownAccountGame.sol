// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TownAccountBase.sol";
import "../game/ResourceLib.sol";
import "../game/BuildingLib.sol";

/**
 * @title TownAccountGame
 * @dev Game-specific implementation of ERC-6551 token bound account for Town Builder
 * Manages town state, resources, buildings, and game mechanics
 */
contract TownAccountGame is TownAccountBase {
    // Custom errors
    error TownAtMaxLevel();
    error InvalidBuildingType();
    error MaxBuildingsReached();
    error InsufficientResources();
    error OnlyTownManager();
    
    // Town properties
    uint8 public townLevel;
    uint256 public lastResourceUpdate;
    
    // Address of the TownManager contract - immutable
    address public immutable townManager;
    
    // Resource and building state
    ResourceLib.Resources public resources;
    BuildingLib.Buildings public buildings;
    
    // Events
    event TownLevelUp(uint256 indexed tokenId, uint8 newLevel);
    event ResourcesUpdated(uint256 wood, uint256 stone, uint256 metal, uint256 food);
    event BuildingConstructed(uint8 buildingType, uint8 level);
    
    /**
     * @dev Modifier to restrict functions to TownManager
     */
    modifier onlyTownManager() {
        if (msg.sender != townManager) revert OnlyTownManager();
        _;
    }
    
    /**
     * @dev Constructor - initialize town at level 1 and set TownManager
     * @param _townManager Address of the TownManager contract
     */
    constructor(address _townManager) {
        require(_townManager != address(0), "Invalid TownManager address");
        
        townManager = _townManager;
        townLevel = 1;
        lastResourceUpdate = block.timestamp;
        
        // Initialize resources
        ResourceLib.initializeResources(resources);
        
        // Initialize town hall at level 1
        buildings.townHall = 1;
    }
    
    /**
     * @dev Get current resource amounts
     */
    function getResources() external view returns (uint256, uint256, uint256, uint256) {
        return ResourceLib.calculateCurrentResources(
            resources,
            buildings,
            lastResourceUpdate
        );
    }
    
    /**
     * @dev Construct or upgrade a building
     */
    function constructBuilding(uint8 buildingType) external {
        if (!_isValidSigner(msg.sender)) revert NotAuthorized();
        
        // Try to construct building (this will handle resource calculation and spending)
        bool success = BuildingLib.tryConstructBuilding(
            resources,
            buildings,
            lastResourceUpdate,
            buildingType,
            townLevel
        );
        
        if (!success) revert InsufficientResources();
        
        // Update the timestamp
        lastResourceUpdate = block.timestamp;
        
        // Increment state
        ++state;
        
        // Get current building level after construction
        uint8 newLevel = BuildingLib.getBuildingLevel(buildings, buildingType);
        
        emit BuildingConstructed(buildingType, newLevel);
        emit ResourcesUpdated(
            resources.wood,
            resources.stone,
            resources.metal,
            resources.food
        );
    }
    
    /**
     * @dev Upgrades the town level if conditions are met
     */
    function upgradeTownLevel() external {
        if (!_isValidSigner(msg.sender)) revert NotAuthorized();
        
        // Check max level
        if (townLevel >= BuildingLib.MAX_TOWN_LEVEL) revert TownAtMaxLevel();
        
        // Get costs from BuildingLib
        (uint256 woodCost, uint256 stoneCost, uint256 metalCost, uint256 foodCost) = 
            BuildingLib.getTownUpgradeCost(townLevel);
        
        // Try to spend resources
        bool success = ResourceLib.trySpendResources(
            resources,
            buildings,
            lastResourceUpdate,
            woodCost,
            stoneCost,
            metalCost,
            foodCost
        );
        
        if (!success) revert InsufficientResources();
        
        // Update the timestamp
        lastResourceUpdate = block.timestamp;
        
        // Increase level
        townLevel += 1;
        
        // Update storage capacity based on new town level
        ResourceLib.updateStorageCapacity(resources, buildings, townLevel);
        
        // Update state counter
        ++state;
        
        // Get token ID for the event
        (,, uint256 tokenId) = token();
        
        emit TownLevelUp(tokenId, townLevel);
        emit ResourcesUpdated(
            resources.wood,
            resources.stone,
            resources.metal,
            resources.food
        );
    }
    
    /**
     * @dev Get building level
     * @param buildingType The type of building to check
     */
    function getBuildingLevel(uint8 buildingType) external view returns (uint8) {
        return BuildingLib.getBuildingLevel(buildings, buildingType);
    }
    
    /**
     * @dev Get count of constructed buildings (level > 0)
     */
    function getTotalBuildings() external view returns (uint8) {
        uint8 count = 0;
        if (buildings.townHall > 0) count++;
        if (buildings.woodHarvester > 0) count++;
        if (buildings.stoneQuarry > 0) count++;
        if (buildings.metalMine > 0) count++;
        if (buildings.farm > 0) count++;
        if (buildings.storageBuilding > 0) count++;
        if (buildings.market > 0) count++;
        return count;
    }
    
    /**
     * @dev Get storage capacity
     */
    function getStorageCapacity() external view returns (uint256) {
        return resources.storageCapacity;
    }
    
    /**
     * @dev Function that can be called by TownManager to perform administrative actions
     * @param to Target address for the call
     * @param value ETH value to send
     * @param data Calldata to send
     */
    function adminExecute(address to, uint256 value, bytes calldata data) 
        external
        onlyTownManager
        returns (bytes memory)
    {
        // Increment state
        ++state;
        
        (bool success, bytes memory result) = to.call{value: value}(data);
        if (!success) revert ExecutionFailed();
        
        return result;
    }
}