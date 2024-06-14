// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    
    /**
     * @dev Constructor
     */
    constructor() ERC721("Town Builder", "TOWN") Ownable(msg.sender) {}
    
    /**
     * @dev Creates a new town for the caller
     * @return tokenId The ID of the newly created town
     */
    function createTown() external returns (uint256) {
        require(balanceOf(msg.sender) == 0, AlreadyOwnsTown());
        
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        
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