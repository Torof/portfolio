// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc6551/interfaces/IERC6551Registry.sol";

/**
 * @title TownNFT
 * @dev ERC-721 contract representing ownership of towns in the Town Builder game
 * Implements one-town-per-address restriction
 */
contract TownNFT is ERC721Enumerable, Ownable {
    // Custom errors
    error AlreadyOwnsTown();
    error InvalidAddress();
    error TownDoesNotExist();
    error RecipientAlreadyOwnsTown();
    
    // Events
    event TownCreated(uint256 indexed tokenId, address owner);
    event TownAccountCreated(uint256 indexed tokenId, address account);
    
    // ERC-6551 Registry address (canonical registry)
    address public immutable erc6551Registry;
    
    // Town Account implementation address
    address public immutable townAccountImplementation;
    
    // Salt used for account creation
    bytes32 public immutable accountSalt;
    
    /**
     * @dev Constructor
     * @param _registry Address of the ERC-6551 Registry
     * @param _implementation Address of the TownAccountGame implementation
     */
    constructor(
        address _registry,
        address _implementation
    ) ERC721("Town Builder", "TOWN") Ownable(msg.sender) {
        require(_registry != address(0), "Invalid registry address");
        require(_implementation != address(0), "Invalid implementation address");
        
        erc6551Registry = _registry;
        townAccountImplementation = _implementation;
        accountSalt = bytes32(0); // Using 0 as salt, could use other values
    }
    
    /**
     * @dev Creates a new town for the caller
     * @return tokenId The ID of the newly created town
     */
    function createTown() external returns (uint256) {
        require(balanceOf(msg.sender) == 0, "AlreadyOwnsTown()");
        
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        
        // Create token bound account for this NFT
        address account = IERC6551Registry(erc6551Registry).createAccount(
            townAccountImplementation,
            accountSalt,
            block.chainid,
            address(this),
            tokenId
        );
        
        emit TownCreated(tokenId, msg.sender);
        emit TownAccountCreated(tokenId, account);
        
        return tokenId;
    }
    
    /**
     * @dev Get the token bound account address for a token
     * @param tokenId The ID of the token
     * @return The address of the token bound account
     */
    function getTownAccount(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "TownDoesNotExist()");
        
        return IERC6551Registry(erc6551Registry).account(
            townAccountImplementation,
            accountSalt,
            block.chainid,
            address(this),
            tokenId
        );
    }
    
    /**
     * @dev Override transfer function to enforce one-town-per-address rule
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        // Prevent transfers to addresses that already have towns
        if (to != address(0)) {
            require(balanceOf(to) == 0, "RecipientAlreadyOwnsTown()");
        }
        
        return super._update(to, tokenId, auth);
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