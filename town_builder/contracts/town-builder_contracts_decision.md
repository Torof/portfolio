# Town Builder Contract Structure

## Contract Organization

```
src/
├── core/
│   ├── TownNFT.sol                  # ERC-721 representing town ownership
│   └── ERC6551Registry.sol          # Registry for creating token bound accounts
├── economy/
│   ├── ResourceToken.sol            # ERC-1155 for tokenized resources
│   └── TownCoin.sol                 # ERC-20 game currency
├── accounts/
│   ├── TownAccountBase.sol          # Base ERC-6551 implementation
│   └── TownAccountGame.sol          # Game-specific town account implementation
└── game/
    ├── TownManager.sol              # Central game logic coordination
    ├── ResourceLib.sol              # Library for resource management
    └── BuildingLib.sol              # Library for building management
```

## Contract Responsibilities

### Core
- **TownNFT**: Represents town ownership with one-town-per-address rule
- **ERC6551Registry**: Creates and manages token bound accounts for NFTs

### Economy
- **ResourceToken**: Tokenized form of resources (wood, stone, metal, food)
- **TownCoin**: Game currency for premium features and marketplace transactions

### Accounts
- **TownAccountBase**: Core ERC-6551 implementation with ownership and permissions
- **TownAccountGame**: Town gameplay mechanics, level tracking, resource and building management

### Game
- **TownManager**: Central coordination, cross-contract interactions, game economy
- **ResourceLib**: Resource utilities, production calculations, and storage management
- **BuildingLib**: Building utilities, effects, and town progression

## Key Design Decisions

1. Town level is stored in TownAccountGame rather than TownNFT to separate ownership from game state
2. Resources are primarily tracked as state variables for gas efficiency
3. Resources can be tokenized when needed through ResourceToken
4. TownAccountGame inherits from TownAccountBase for clean separation of concerns
5. Libraries are used for utility functions to reduce contract size and improve reusability