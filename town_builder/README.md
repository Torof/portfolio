# 🏙️ Town Builder: Core Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Resource System](#resource-system)
4. [Building System](#building-system)
5. [Town Progression](#town-progression)
6. [Economic Model](#economic-model)
7. [Token Implementation](#token-implementation)
8. [Technical Optimizations](#technical-optimizations)
9. [Project Context & Considerations](#project-context--considerations)
10. [Frontend Design](#frontend-design)
11. [Development Roadmap](#development-roadmap)

## 🌟 Project Overview

Town Builder is a blockchain-based project that demonstrates advanced NFT functionality using the ERC-6551 token bound account standard. Players own unique towns that produce resources and can construct buildings over time, with an optimized gas-efficient architecture.

### ✨ Core Features
- 🏠 Towns as ERC-721 NFTs with ERC-6551 token bound accounts
- 🌲 Resources tracked primarily as state variables for gas efficiency
- 🏗️ Buildings tracked as state variables within town accounts
- ⏱️ Resource production based on buildings and time
- 📈 Town progression system with levels
- 💰 TownCoin (ERC-20) as the game economy currency
- 🔄 Ability to convert resources between state variables and ERC-1155 tokens

### 💻 Technical Showcase
- 📜 ERC-721 implementation with ownership restrictions
- 🔗 ERC-6551 token bound accounts
- 🧮 Gas-optimized resource tracking system
- 💎 Hybrid state variable / token approach
- 🪙 ERC-20 implementation for game economy
- 🛠️ Foundry development framework
- 🎮 Three.js visualization

## 🏗️ Smart Contract Architecture

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ 🏠 TownNFT     │     │ 💼 TownAccount │     │ 🌲 ResourceToken│
│ (ERC-721)      │────>│ (ERC-6551)     │<────│ (ERC-1155)     │
└────────────────┘     └────────────────┘     └────────────────┘
        │                      ▲                      ▲
        │                      │                      │
        v                      │                      │
┌────────────────┐     ┌──────┴───────────┐     ┌────┴───────────┐
│ 📋 ERC6551     │     │ 🎮 TownManager   │────>│ 💰 TownCoin    │
│ Registry       │────>│                  │     │ (ERC-20)       │
└────────────────┘     └──────────────────┘     └────────────────┘
                               │
                               │
                               v
                        ┌────────────────┐
                        │ 🏢 BuildingSystem│
                        │ (optional)     │
                        └────────────────┘
```

### 📚 Core Contracts

| Contract | Standard | Purpose |
|----------|----------|---------|
| 🏠 **TownNFT** | ERC-721 | Represents unique town ownership |
| 💼 **TownAccount** | ERC-6551 | Token bound account for each town |
| 🌲 **ResourceToken** | ERC-1155 | Tokenized representation of resources (used selectively) |
| 💰 **TownCoin** | ERC-20 | Game currency for premium features |
| 🎮 **TownManager** | Custom | Central game logic and state management |
| 🏢 **BuildingSystem** | Custom | Building construction and effects (may be integrated into TownManager) |

## 💎 Resource System

### 🧮 State Variable Resource Tracking
- Resources (wood, stone, metal, food) primarily tracked as state variables
- More gas-efficient than token operations for regular gameplay
- Time-based calculation for resource production:
  - Timestamp of last update stored on-chain
  - Current resources calculated based on production rates and elapsed time
  - No continuous updates required

### 🔄 Resource Conversion
- Resources can be converted to ERC-1155 tokens when needed
- Tokenized resources can be converted back to state variables
- This hybrid approach minimizes gas costs while maintaining token functionality

### 📦 Storage Capacity
- Each town has limited storage capacity for resources
- Storage capacity increases with town level and storage buildings
- Resources beyond capacity are lost (not produced)

### ⚖️ Resource Production Formula
```
availableResource = productionRate * (currentTime - lastUpdateTime) / timeUnit
```

## 🏢 Building System

| Building | Primary Function | Resource Production | Special Function |
|----------|------------------|---------------------|-----------------|
| 🏛️ **Town Hall** | Town level gate | - | Enables town upgrades |
| 🪓 **Wood Harvester** | Wood production | 1 wood/min (base) | - |
| ⛏️ **Stone Quarry** | Stone production | 1 stone/min (base) | - |
| 🔨 **Metal Mine** | Metal production | 1 metal/min (base) | - |
| 🌾 **Farm** | Food production | 1 food/min (base) | - |
| 🏪 **Storage** | Increase capacity | - | +100 storage per level |
| 🏦 **Market** | Economic hub | - | Resource to TownCoin conversion |

### 📈 Building Levels
Each building can be upgraded to improve its efficiency:
- **Level 1**: Base production/effect
- **Level 2**: +50% production/effect  
- **Level 3**: +100% production/effect
- **Level 4**: +150% production/effect
- **Level 5**: +200% production/effect

### 🏗️ Building Implementation
- Buildings stored as state variables, not tokens
- Bit-packed storage for gas efficiency (8 bits per building type)
- Maps building types to levels for each town
- Enforces building limits based on town level

## 📈 Town Progression

### 🏆 Town Levels

| Level | Max Buildings | Upgrade Cost | Resource Cap Multiplier |
|-------|---------------|--------------|-------------------------|
| 1️⃣ | 10 | Initial | 1x |
| 2️⃣ | 15 | 50 of each resource | 2x |
| 3️⃣ | 20 | 100 of each resource | 3x |
| 4️⃣ | 25 | 200 of each resource | 4x |
| 5️⃣ | 30 | 400 of each resource | 5x |

## 💰 Economic Model

### 🪙 TownCoin (ERC-20)
- In-game currency implemented as ERC-20 token
- Generated through Market building by converting resources
- Used for premium features and future marketplace transactions

### 🏦 Market Building
- Converts state variable resources to TownCoin
- Higher level Markets provide better conversion rates
- Creates economic incentive for resource production

### 💱 Conversion Rates (Example)
| Market Level | Wood per Coin | Stone per Coin | Metal per Coin | Food per Coin |
|--------------|---------------|----------------|----------------|---------------|
| 1 | 100 | 80 | 50 | 120 |
| 2 | 90 | 70 | 45 | 110 |
| 3 | 80 | 60 | 40 | 100 |

## 🔄 Token Implementation

### 🏠 TownNFT (ERC-721)
- Each token represents a unique town
- Contains basic town metadata (level, creation date)
- Links to its token bound account via ERC-6551
- Enforces one-town-per-address rule

### 💼 TownAccount (ERC-6551)
- Each town has its own token bound account
- Account maintains town assets when ownership changes
- Allows town to own ERC-1155 resource tokens when tokenized
- Controlled by current town owner

### 🌲 ResourceToken (ERC-1155)
- Single contract handling all resource types
- Different token IDs for different resources
- Used only when resources need to be tokenized
- Not used for regular resource production/consumption

### 🪙 TownCoin (ERC-20)
- Standard implementation with minting capability
- Minted through Market building resource conversion
- Used for premium features and upgrades
- Foundation for future marketplace transactions

## ⛽ Technical Optimizations

### 🧮 State Variable Resource Tracking
- Most gas-efficient approach for frequently updated values
- Avoids expensive token operations for regular gameplay
- Uses timestamps and rates rather than continuous updates

### 📦 Storage Packing
- Optimizes storage usage for gas efficiency
- Packs multiple values into single storage slots
- Uses bit packing for building tracking

### ⌛ Lazy Evaluation
- Calculates resources on-demand rather than storing continuously
- Only performs token operations when explicitly needed
- Minimizes state changes for better gas efficiency

### 🧩 Hybrid Token Model
- Uses state variables for frequent operations
- Provides tokenization capability when needed
- Balances gas efficiency with blockchain functionality

## 🎨 Frontend Design

[Frontend design remains as in original documentation]

## 📅 Development Roadmap

| Phase | Task | Time Estimate | Subtasks |
|-------|------|---------------|----------|
| 1️⃣ | 🚀 **Project Setup** | 1-2 hours | Foundry initialization, contract scaffolding, package setup |
| 2️⃣ | 📜 **Core Contracts** | 4-5 hours | TownNFT, TownAccount (ERC-6551), TownManager foundation |
| 3️⃣ | 🧮 **Resource System** | 3-4 hours | State variable tracking, production calculation, storage limits |
| 4️⃣ | 🏗️ **Building System** | 2-3 hours | Building implementation, resource consumption, production effects |
| 5️⃣ | 💰 **Economic System** | 2-3 hours | TownCoin implementation, Market building, conversion rates |
| 6️⃣ | 🔄 **Tokenization** | 2-3 hours | Resource tokenization, token bound account integration |
| 7️⃣ | 🖥️ **Frontend Base** | 3-4 hours | React app setup, ethers.js integration, Three.js initialization |
| **Total** |  | **17-24 hours** | |

### 🔑 Project Context & Considerations

### 🎯 Portfolio Showcase Purpose
Town Builder is intentionally designed as a skills showcase project to demonstrate advanced blockchain development capabilities. The implementation choices prioritize technical depth and comprehensive on-chain mechanics over commercial optimization.

### 💡 On-Chain vs. Off-Chain Awareness
While the project implements most game logic on-chain for demonstration purposes, it's worth acknowledging the commercial approach would differ:

#### Commercial Implementation Alternative
For a commercially viable blockchain game, the optimal architecture would:
- Move most gameplay logic off-chain (resource production, building management)
- Use traditional game servers for state management and calculations
- Keep only essential elements on-chain:
  - NFT Town ownership (ERC-721)
  - TownCoin economy (ERC-20)
  - Tokenized resources when traded (ERC-1155)
  - Core economic transactions

This "verify, don't compute" approach is industry standard for viable blockchain games, reducing transaction costs while preserving true ownership and economic benefits.

### 🧠 Design Philosophy
The current architecture explicitly showcases:
1. Advanced smart contract optimization techniques
2. Deep understanding of gas efficiency considerations
3. Token standard implementations and interactions
4. Blockchain-native game mechanics
5. Thoughtful economic design

This architecture demonstrates the technical knowledge to implement fully on-chain systems while acknowledging that hybrid approaches are often more practical for commercial applications.

## 🔮 Future Extensions

The following features are planned for future development:

### 💰 Marketplace System
- Player-to-player resource trading
- Resource listing and purchasing with TownCoin
- Automated conversion between state variables and tokens

### 👑 Mayor System (ERC-721)
- Special NFTs providing town bonuses
- Different mayor types with unique abilities
- Can be purchased with TownCoin
- Transferable between towns

### 🌟 Additional Future Extensions
- 🎨 Town customization options
- 🏆 Special limited-time buildings
- 🏅 Achievement system
- 📊 Town leaderboards