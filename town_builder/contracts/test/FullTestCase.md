# Advanced Testing Plan for Town Builder

## Current Test Coverage

We currently have solid unit test coverage for the individual components:

1. **TownNFT Tests**
   - NFT creation and ownership
   - One-town-per-address restriction
   - Token transfers
   - ERC-6551 binding

2. **ResourceLib Tests**
   - Resource initialization
   - Production calculation with storage caps
   - Resource spending
   - Storage capacity calculation

3. **BuildingLib Tests**
   - Building construction rules
   - Building level restrictions
   - Building and town upgrade costs
   - Storage updates

4. **TownAccountGame Tests**
   - Initialization
   - Resource accumulation
   - Town manager functionality

## Upcoming Contracts to Test

These contracts still need to be implemented and tested:

1. **TownManager Tests**
   - Global game coordination
   - Cross-town interactions
   - Administrative functions
   - Emergency pause/recovery functionality

2. **TownCoin Tests (ERC-20)**
   - Minting mechanics
   - Token transfers
   - Resource-to-coin conversion
   - Allowances and approvals
   - Integration with Market building

3. **ResourceToken Tests (ERC-1155)**
   - Token minting from state variables
   - Converting back to state variables
   - Batch transfers
   - Ownership verification
   - Resource balance consistency

## Core Component Testing

After implementing the remaining contracts, we'll need unit tests for each:

### TownManager Contract Tests

1. **Global State Management**
   - Test initialization and configuration
   - Test game-wide parameter updates
   - Test registry and lookup functions

2. **Town Interaction**
   - Test interactions with multiple town accounts
   - Test permission management
   - Test event emission and tracking

3. **Admin Functions**
   - Test emergency controls
   - Test privileged operations
   - Test ownership transfer

### TownCoin (ERC-20) Tests

1. **Token Fundamentals**
   - Test basic ERC-20
   - Test transfer restrictions
   - Test allowances

2. **Economic Functions**
   - Test minting mechanics
   - Test resource conversion rates
   - Test market building integration
   - Test burn mechanics if implemented

3. **Security**
   - Test minting authorization
   - Test economic balancing
   - Test inflation controls

### ResourceToken (ERC-1155) Tests

1. **Token Fundamentals**
   - Test ERC-1155 functions
   - Test batch operations
   - Test URI handling

2. **Resource System Integration**
   - Test conversion from state variables
   - Test conversion back to state variables
   - Test metadata consistency

3. **Balance Consistency**
   - Test resource accounting accuracy
   - Test conversions don't create or destroy value
   - Test storage limit enforcement

## Additional Integration Testing Required

### 1. End-to-End Integration Tests

Test the complete system working together:

- **Complete Player Journey**
  - Mint NFT → Create token bound account → Gather resources → Build buildings → Upgrade town
  - Verify correct state changes across contracts

- **NFT Transfer Scenario**
  - Test what happens when NFT ownership transfers
  - Ensure resources, buildings, and progress transfer with ownership
  - Verify old owner loses access and new owner gains control

- **Multi-Player Interactions**
  - Test scenarios with multiple players
  - Verify town-per-address restrictions work in complex scenarios

### 2. Security/Penetration Testing

Attempt to break the system:

- **Authorization Bypasses**
  - Try to call restricted functions directly
  - Attempt to manipulate token ownership
  - Test building without resources

- **Resource Exploits**
  - Attempt to generate infinite resources
  - Test timestamp manipulation attacks
  - Try to exceed storage capacity

- **Economic Exploits**
  - Look for arbitrage opportunities
  - Test for integer overflow/underflow
  - Check for re-entrancy vulnerabilities

- **Ownership Manipulation**
  - Flash loan attacks
  - Try to maintain control after NFT transfer
  - Attempt to control multiple towns

### 3. Edge Case Testing

Test boundary conditions:

- **Maximum Values**
  - Maximum resource amounts
  - Maximum building levels
  - Maximum town level

- **Zero/Empty Values**
  - Test with zero resources
  - Test with no buildings
  - Test with zero elapsed time

- **Gas Limits**
  - Measure gas usage in various scenarios
  - Test operations that might approach block gas limits
  - Optimize gas-intensive operations

### 4. Invariant/Fuzzing Tests

Run automated property-based tests:

- **Resource Invariants**
  - Resources should never exceed capacity
  - Resources should never be negative

- **Building Invariants**
  - Buildings should never exceed town hall level
  - Buildings should never exceed max level

- **State Consistency**
  - NFT owner should always control account
  - Resource production should be deterministic

## Testing Tools and Approaches

- **Foundry Fuzzing/Invariant Testing**
  - Use Foundry's built-in fuzzing capabilities
  - Define invariants that should never be violated

- **Exploit Scenarios**
  - Create specific test cases for known attack vectors
  - Test contract interactions in unexpected sequences

- **Gas Optimization Analysis**
  - Profile gas usage across different operations
  - Identify optimization opportunities

## Implementation Plan

1. Create integration test suite that tests the full system
2. Implement security tests focusing on attack vectors
3. Add edge case tests for boundary conditions
4. Set up fuzzing/invariant tests for automated testing
5. Perform gas analysis and optimization