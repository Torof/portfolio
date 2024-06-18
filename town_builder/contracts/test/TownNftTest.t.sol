// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/TownNFT.sol";
import "../src/accounts/TownAccountGame.sol";
import {ERC6551Registry as Registry} from "erc6551/ERC6551Registry.sol";
// // Simple registry implementation for testing
// contract TestERC6551Registry is IERC6551Registry {
//     mapping(bytes32 => address) private _accountAddresses;
    
//     function createAccount(
//         address implementation,
//         bytes32 salt,
//         uint256 chainId,
//         address tokenContract,
//         uint256 tokenId
//     ) external returns (address) {
//         bytes32 key = keccak256(abi.encode(implementation, salt, chainId, tokenContract, tokenId));
//         address accountAddress;
        
//         if (_accountAddresses[key] == address(0)) {
//             // For testing, generate a deterministic address
//             accountAddress = address(uint160(uint256(key)));
//             _accountAddresses[key] = accountAddress;
            
//             emit ERC6551AccountCreated(
//                 accountAddress,
//                 implementation,
//                 salt,
//                 chainId,
//                 tokenContract,
//                 tokenId
//             );
//         } else {
//             accountAddress = _accountAddresses[key];
//         }
        
//         return accountAddress;
//     }

//     function account(
//         address implementation,
//         bytes32 salt,
//         uint256 chainId,
//         address tokenContract,
//         uint256 tokenId
//     ) external view returns (address) {
//         bytes32 key = keccak256(abi.encode(implementation, salt, chainId, tokenContract, tokenId));
//         return _accountAddresses[key];
//     }
// }

contract TownNFTTest is Test {
    TownNFT public townNFT;
    Registry public registry;
    TownAccountGame public implementation;
    address public owner = address(1);
    address public player1 = address(2);
    address public player2 = address(3);

    function setUp() public {
        // Deploy the ERC6551Registry
        registry = new Registry();
        
        // Deploy the TownAccountGame implementation
        // Need to pass a town manager address for the constructor
        address mockTownManager = address(4);
        implementation = new TownAccountGame(mockTownManager);
        
        // Deploy the TownNFT with the registry and implementation
        vm.startPrank(owner);
        townNFT = new TownNFT(address(registry), address(implementation));
        vm.stopPrank();
    }

    function testCreateTown() public {
        // Player 1 creates a town
        vm.startPrank(player1);
        uint256 tokenId = townNFT.createTown();
        vm.stopPrank();
        
        // Check if the town was created correctly
        assertEq(townNFT.ownerOf(tokenId), player1);
        assertEq(townNFT.balanceOf(player1), 1);
        
        // Check if the token bound account was created
        address accountAddress = townNFT.getTownAccount(tokenId);
        assertTrue(accountAddress != address(0));
    }

    function testOneTownPerAddress() public {
        // Player 1 creates a town
        vm.startPrank(player1);
        townNFT.createTown();
        
        // Try to create another town - should revert
        vm.expectRevert("AlreadyOwnsTown()");
        townNFT.createTown();
        vm.stopPrank();
    }

    function testTransferTown() public {
        // Player 1 creates a town
        vm.startPrank(player1);
        uint256 tokenId = townNFT.createTown();
        
        // Transfer to player 2
        townNFT.transferFrom(player1, player2, tokenId);
        vm.stopPrank();
        
        // Check if transferred correctly
        assertEq(townNFT.ownerOf(tokenId), player2);
        assertEq(townNFT.balanceOf(player1), 0);
        assertEq(townNFT.balanceOf(player2), 1);
    }

    function testCannotTransferToAddressWithTown() public {
        // Player 1 creates a town
        vm.startPrank(player1);
        uint256 tokenId1 = townNFT.createTown();
        vm.stopPrank();
        
        // Player 2 creates a town
        vm.startPrank(player2);
        uint256 tokenId2 = townNFT.createTown();
        vm.stopPrank();
        
        // Player 1 tries to transfer to player 2 - should revert
        vm.startPrank(player1);
        vm.expectRevert("RecipientAlreadyOwnsTown()");
        townNFT.transferFrom(player1, player2, tokenId1);
        vm.stopPrank();
    }
}