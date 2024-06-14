// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Import interfaces from the ERC-6551 library
import "erc6551/interfaces/IERC6551Account.sol";
import "erc6551/interfaces/IERC6551Executable.sol";

/**
 * @title TownAccountBase
 * @dev Base implementation of ERC-6551 token bound account for Town Builder
 */
contract TownAccountBase is IERC165, IERC1271, IERC6551Account, IERC6551Executable {
    // This is the chain ID where the contract is deployed
    uint256 private immutable _deploymentChainId;
    
    // State counter that changes whenever account state changes
    uint256 public state;

    // Valid signer magic value per ERC-6551
    bytes4 internal constant VALID_SIGNER_MAGIC_VALUE = 0x523e3260;
    
    // Custom errors
    error InvalidOperation();
    error NotAuthorized();
    error ExecutionFailed();
    
    constructor() {
        _deploymentChainId = block.chainid;
    }
    
    // Allow account to receive ETH
    receive() external payable {}
    
    /**
     * @dev Returns the identifier of the non-fungible token which owns the account
     */
    function token() public view returns (uint256 chainId, address tokenContract, uint256 tokenId) {
        // The token data is stored in the bytecode of the contract
        bytes memory footer = new bytes(0x60);
        
        assembly {
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }
        
        return abi.decode(footer, (uint256, address, uint256));
    }
    
    /**
     * @dev Returns the owner of the NFT bound to this account
     */
    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = token();
        
        // Only check ownership on the deployment chain
        if (chainId != _deploymentChainId) return address(0);
        
        return IERC721(tokenContract).ownerOf(tokenId);
    }
    
    /**
     * @dev Checks if the signer is valid for this account
     */
    function isValidSigner(address signer, bytes calldata) external view returns (bytes4) {
        return _isValidSigner(signer) ? VALID_SIGNER_MAGIC_VALUE : bytes4(0);
    }
    
    /**
     * @dev Internal function to check if the signer is valid
     */
    function _isValidSigner(address signer) internal view returns (bool) {
        return signer == owner();
    }
    
    /**
     * @dev ERC-1271 implementation for signature validation
     */
    function isValidSignature(bytes32 hash, bytes memory signature) 
        external 
        view 
        returns (bytes4 magicValue) 
    {
        // Check if the signature is valid for the owner of the NFT
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);
        
        // Return the magic value if the signature is valid
        return isValid ? IERC1271.isValidSignature.selector : bytes4(0);
    }
    
    /**
     * @dev Executes an operation if the caller is a valid signer
     * @param to Target address of the operation
     * @param value Ether value to send to the target
     * @param data Calldata to send to the target
     * @param operation Type of operation (0=CALL, 1=DELEGATECALL, etc)
     */
    function execute(address to, uint256 value, bytes calldata data, uint8 operation)
        external
        payable
        returns (bytes memory)
    {
        // Check if caller is authorized
        if (!_isValidSigner(msg.sender)) revert NotAuthorized();
        
        // Increment state (since we're changing state)
        ++state;
        
        // Perform operation based on operation type
        if (operation == 0) {
            // CALL operation
            (bool success, bytes memory result) = to.call{value: value}(data);
            if (!success) revert ExecutionFailed();
            return result;
        } else if (operation == 1) {
            // DELEGATECALL operation - be very careful with this!
            (bool success, bytes memory result) = to.delegatecall(data);
            if (!success) revert ExecutionFailed();
            return result;
        } else {
            // Unsupported operation
            revert InvalidOperation();
        }
    }
    
    /**
     * @dev ERC-165 implementation to detect interfaces
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IERC6551Executable).interfaceId ||
            interfaceId == type(IERC1271).interfaceId;
    }
}