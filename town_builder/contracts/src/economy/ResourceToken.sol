// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc6551/interfaces/IERC6551Account.sol";
import "erc6551/interfaces/IERC6551Registry.sol";

/**
 * @title ResourceToken
 * @dev ERC-1155 token representing resources in Town Builder
 * Agnostic implementation that only handles token operations
 * Only allows town accounts to mint/burn tokens
 * Restricts transfers to only allow marketplace interactions
 */
contract ResourceToken is ERC1155, Ownable {
    // Custom errors
    error NotAuthorized();
    error InsufficientTokens();
    error InvalidResourceType();
    error InvalidAmount();
    error TransferRestricted();
    
    // Resource type constants - match ResourceLib for consistency
    uint256 public constant WOOD = 0;
    uint256 public constant STONE = 1;
    uint256 public constant METAL = 2;
    uint256 public constant FOOD = 3;
    
    // Reference to the ERC-6551 registry
    IERC6551Registry public immutable registry;
    
    // Address of the TownNFT contract
    address public immutable townNFTContract;
    
    // Address of the town account implementation
    address public immutable accountImplementation;
    
    // Address of the marketplace contract
    address public marketplace;
    
    // Salt used for account creation
    bytes32 public immutable accountSalt;
    
    // Events
    event TokenMinted(address indexed account, uint256 resourceType, uint256 amount);
    event TokenBurned(address indexed account, uint256 resourceType, uint256 amount);
    event MarketplaceSet(address indexed marketplace);
    
    /**
     * @dev Constructor
     * @param uri_ The URI for token metadata
     * @param _registry Address of the ERC-6551 registry
     * @param _townNFTContract Address of the TownNFT contract
     * @param _accountImplementation Address of the town account implementation
     * @param _accountSalt Salt used for account creation
     */
    constructor(
        string memory uri_,
        address _registry,
        address _townNFTContract,
        address _accountImplementation,
        bytes32 _accountSalt
    ) ERC1155(uri_) Ownable(msg.sender) {
        require(_registry != address(0), "Invalid registry address");
        require(_townNFTContract != address(0), "Invalid TownNFT address");
        require(_accountImplementation != address(0), "Invalid implementation address");
        
        registry = IERC6551Registry(_registry);
        townNFTContract = _townNFTContract;
        accountImplementation = _accountImplementation;
        accountSalt = _accountSalt;
    }
    
    /**
     * @dev Set the marketplace address that's allowed for transfers
     * @param _marketplace The address of the authorized marketplace
     */
    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid address");
        marketplace = _marketplace;
        emit MarketplaceSet(_marketplace);
    }
    
    /**
     * @dev Checks if a resource type is valid
     * @param resourceType The resource type to check
     * @return bool Whether the resource type is valid
     */
    function isValidResourceType(uint256 resourceType) public pure returns (bool) {
        return resourceType <= FOOD; // FOOD is the highest index (3)
    }
    
    /**
     * @dev Mint tokens to caller (only callable by valid town accounts)
     * @param resourceType The type of resource token to mint
     * @param amount The amount to mint
     */
    function mintToken(uint256 resourceType, uint256 amount) external {
        // Check valid resource type and amount
        if (!isValidResourceType(resourceType)) revert InvalidResourceType();
        if (amount == 0) revert InvalidAmount();
        
        // Verify caller is a valid town account
        if (!isTownAccount(msg.sender)) revert NotAuthorized();
        
        // Mint tokens to the town account
        _mint(msg.sender, resourceType, amount, "");
        
        emit TokenMinted(msg.sender, resourceType, amount);
    }
    
    /**
     * @dev Burn tokens from caller (only callable by valid town accounts)
     * @param resourceType The type of resource token to burn
     * @param amount The amount to burn
     */
    function burnToken(uint256 resourceType, uint256 amount) external {
        // Check valid resource type and amount
        if (!isValidResourceType(resourceType)) revert InvalidResourceType();
        if (amount == 0) revert InvalidAmount();
        
        // Verify caller is a valid town account
        if (!isTownAccount(msg.sender)) revert NotAuthorized();
        
        // Verify caller has enough tokens
        if (balanceOf(msg.sender, resourceType) < amount) revert InsufficientTokens();
        
        // Burn tokens
        _burn(msg.sender, resourceType, amount);
        
        emit TokenBurned(msg.sender, resourceType, amount);
    }
    
    /**
     * @dev Verify if an address is a valid town account from our game
     * @param account The address to check
     * @return bool Whether the address is a valid town account
     */
    function isTownAccount(address account) public view returns (bool) {
        // Use low-level call to get token information
        (bool success, bytes memory data) = account.staticcall(
            abi.encodeWithSignature("token()")
        );
        
        if (!success || data.length != 96) return false; // Not a valid token bound account
        
        // Decode the result
        (uint256 chainId, address tokenContract, uint256 tokenId) = abi.decode(
            data,
            (uint256, address, uint256)
        );
        
        // Verify the token is from our game
        if (tokenContract != townNFTContract) return false;
        
        // Check that the account address matches what the registry calculates
        address calculatedAccount = registry.account(
            accountImplementation,
            accountSalt,
            chainId,
            tokenContract,
            tokenId
        );
        
        // Only valid if the address matches the calculation
        return account == calculatedAccount;
    }
    
    /**
     * @dev Override transfer function to restrict transfers
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        // Only allow transfers to/from the marketplace or by the contract owner
        if (to != marketplace && from != marketplace && msg.sender != owner()) {
            revert TransferRestricted();
        }
        
        super.safeTransferFrom(from, to, id, amount, data);
    }
    
    /**
     * @dev Override batch transfer function to restrict transfers
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        // Only allow transfers to/from the marketplace or by the contract owner
        if (to != marketplace && from != marketplace && msg.sender != owner()) {
            revert TransferRestricted();
        }
        
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}