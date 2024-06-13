// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TownNFT
 * @dev ERC-721 contract representing ownership of towns in the Town Builder game
 * Implements one-town-per-address restriction and basic town level
 */
contract TownNFT is ERC721Enumerable, Ownable {
    // Custom errors
    error AlreadyOwnsTown();
    error InvalidAddress();
    error OnlyTownManager();
    error TownDoesNotExist();
    error TownAtMaxLevel();
    error RecipientAlreadyOwnsTown();
    
    // Only tracking town level
    mapping(uint256 => uint8) public townLevels;
    
    // Max level for towns
    uint8 public constant MAX_TOWN_LEVEL = 5;
    
    // Address of the TownManager contract
    address public townManager;
    
    // Events
    event TownCreated(uint256 indexed tokenId, address owner);
    event TownLevelUp(uint256 indexed tokenId, uint8 newLevel);
    event TownManagerSet(address townManager);
    
    /**
     * @dev Constructor
     */
    constructor() ERC721("Town Builder", "TOWN") Ownable(msg.sender) {}
    
    /**
     * @dev Set the address of the TownManager contract
     * @param _townManager The address of the TownManager
     */
    function setTownManager(address _townManager) external onlyOwner {
        require(_townManager != address(0), InvalidAddress());
        townManager = _townManager;
        emit TownManagerSet(_townManager);
    }
    
    /**
     * @dev Modifier to check if caller is the TownManager
     */
    modifier onlyTownManager() {
        require(msg.sender == townManager, OnlyTownManager());
        _;
    }
    
    /**
     * @dev Creates a new town for the caller
     * @return tokenId The ID of the newly created town
     */
    function createTown() external returns (uint256) {
        require(balanceOf(msg.sender) == 0, AlreadyOwnsTown());
        
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        
        // Initialize town at level 1
        townLevels[tokenId] = 1;
        
        emit TownCreated(tokenId, msg.sender);
        return tokenId;
    }
    
    /**
     * @dev Override transfer function to enforce one-town-per-address rule
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        // Prevent transfers to addresses that already have towns
        if (to != address(0)) {
            require(balanceOf(to) == 0, RecipientAlreadyOwnsTown());
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Increases the level of a town - can only be called by TownManager
     * @param tokenId The ID of the town to upgrade
     */
    function upgradeTownLevel(uint256 tokenId) external onlyTownManager {
        require(_exists(tokenId), TownDoesNotExist());
        require(townLevels[tokenId] < MAX_TOWN_LEVEL, TownAtMaxLevel());
        
        // Increase level
        townLevels[tokenId] += 1;
        
        emit TownLevelUp(tokenId, townLevels[tokenId]);
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId The ID to check
     * @return bool Whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Define the base URI for token metadata
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://townbuilder.example/metadata/";
    }
}