# 🏙️ Town Builder: Core Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Token System](#token-system)
4. [Game Mechanics](#game-mechanics)
5. [Buildings](#buildings)
6. [Resources](#resources)
7. [Town Progression](#town-progression)
8. [Technical Implementation](#technical-implementation)
9. [Frontend Design](#frontend-design)
10. [Development Roadmap](#development-roadmap)
11. [Future Extensions](#future-extensions)

## 🌟 Project Overview

Town Builder is a blockchain-based project that demonstrates advanced NFT functionality using the ERC-6551 token bound account standard. Players own unique towns that produce resources and can construct buildings over time.

### ✨ Core Features
- 🏠 Towns as ERC-721 NFTs with ERC-6551 token bound accounts
- 🌲 Resources as ERC-1155 tokens owned by town accounts
- 🏗️ Buildings tracked as state variables within town accounts
- ⏱️ Resource production based on buildings and time
- 📈 Town progression system with levels

### 💻 Technical Showcase
- 📜 ERC-721 implementation with ownership restrictions
- 🔗 ERC-6551 token bound accounts
- 🧩 ERC-1155 semi-fungible tokens
- 🛠️ Foundry development framework
- 🎮 Three.js visualization

## 🏗️ Smart Contract Architecture

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ 🏠 TownNFT     │     │ 💼 TownAccount │     │ 🌲 ResourceToken│
│ (ERC-721)      │────>│ (ERC-6551)     │────>│ (ERC-1155)     │
└────────────────┘     └────────────────┘     └────────────────┘
        │                      │                      │
        │                      │                      │
        v                      v                      v
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ 🎮 TownManager │     │ 📋 ERC6551     │     │ 🏢 BuildingSystem│
│                │<────┤ Registry       │     │                │
└────────────────┘     └────────────────┘     └────────────────┘
```

### 📚 Core Contracts

| Contract | Standard | Purpose |
|----------|----------|---------|
| 🏠 **TownNFT** | ERC-721 | Represents unique town ownership |
| 💼 **TownAccount** | ERC-6551 | Token bound account for each town |
| 🌲 **ResourceToken** | ERC-1155 | Semi-fungible tokens for resources |
| 🎮 **TownManager** | Custom | Handles game logic and state |
| 🏢 **BuildingSystem** | Custom | Manages building construction and effects |

## 💎 Token System

### 🏠 TownNFT (ERC-721)
- Each token represents a unique town
- Contains basic town metadata (level, creation date)
- Links to its token bound account via ERC-6551
- Enforces one-town-per-address rule

### 🌲 ResourceToken (ERC-1155)
- Single contract handling all resource types
- Different token IDs for different resources
- Owned by town accounts, not directly by players
- Resources are produced by buildings over time

### 🔗 ERC-6551 Integration
- Each town has its own token bound account
- Account maintains town assets when ownership changes
- Allows town to own ERC-1155 resource tokens
- Controlled by current town owner

## 🎮 Game Mechanics

### 🏠 Town Ownership
- Each player can own only one town at a time
- Towns are transferable ERC-721 tokens
- When a town is transferred, all its resources remain with it
- Ownership is tracked and enforced in the TownNFT contract

### 🌲 Resource Production
- Resources accumulate over time based on buildings
- Time-based calculation determines available resources
- Resources are stored as ERC-1155 tokens in the town's account
- Production rates depend on building types and levels

### 🏗️ Building System
- Buildings are tracked as state variables (not tokens)
- Each town can have multiple types of buildings
- Buildings produce resources or provide special functions
- Building construction requires resources
- Building levels are gated by town level

### 📦 Storage Capacity
- Each town has limited storage capacity for resources
- Storage capacity increases with town level and storage buildings
- Resources beyond capacity are lost (not produced)

## 🏢 Buildings

| Building | Primary Function | Resource Production | Special Function |
|----------|------------------|---------------------|-----------------|
| 🏛️ **Town Hall** | Town level gate | - | Enables town upgrades |
| 🪓 **Wood Harvester** | Wood production | 1 wood/min (base) | - |
| ⛏️ **Stone Quarry** | Stone production | 1 stone/min (base) | - |
| 🔨 **Metal Mine** | Metal production | 1 metal/min (base) | - |
| 🌾 **Farm** | Food production | 1 food/min (base) | - |
| 🏪 **Storage** | Increase capacity | - | +100 storage per level |

### 📈 Building Levels

Each building can be upgraded to improve its efficiency:
- **Level 1**: Base production/effect
- **Level 2**: +50% production/effect  
- **Level 3**: +100% production/effect
- **Level 4**: +150% production/effect
- **Level 5**: +200% production/effect

## 🌳 Resources

| Resource | Token ID | Primary Use | Storage Base Capacity |
|----------|----------|-------------|----------------------|
| 🪵 **Wood** | 1 | Building construction | 100 |
| 🪨 **Stone** | 2 | Building construction | 100 |
| ⚙️ **Metal** | 3 | Building construction | 100 |
| 🍎 **Food** | 4 | Town level upgrades | 100 |

### ⚖️ Resource Production Formula
```
availableResource = productionRate * (currentTime - lastCollectionTime)
```

### 📦 Storage Capacity Formula
```
maxStorage = baseStorage + (storageLevel * 100)
```

## 📈 Town Progression

### 🏆 Town Levels

| Level | Max Buildings | Upgrade Cost | Resource Cap Multiplier |
|-------|---------------|--------------|-------------------------|
| 1️⃣ | 10 | Initial | 1x |
| 2️⃣ | 15 | 50 of each resource | 2x |
| 3️⃣ | 20 | 100 of each resource | 3x |
| 4️⃣ | 25 | 200 of each resource | 4x |
| 5️⃣ | 30 | 400 of each resource | 5x |

### 🏗️ Building Constraints
- Town Hall level gates other building levels
- Total buildings limited by town level
- Building placement is tracked but not visually constrained

## 🔧 Technical Implementation

### 🧰 Contract System Overview

The project will utilize the following smart contract architecture:

**🏠 TownNFT (ERC-721)**
- Implements the one-town-per-address rule
- Tracks town level and metadata
- Links to town's ERC-6551 account
- Manages town creation and transfers

**🌳 ResourceToken (ERC-1155)**
- Manages all resource types (wood, stone, metal, food)
- Implements minting and burning functionality
- Owned by town accounts rather than players directly

**🎮 TownManager**
- Coordinates interactions between contracts
- Manages building construction and upgrades
- Handles resource production calculations
- Controls town progression and limitations

**📋 ERC-6551 Registry & Implementation**
- Standard ERC-6551 contract for account creation
- Links each town NFT to its token bound account
- Enables town accounts to own resources as NFTs

### ✨ Key Technical Features

**👤 One-Town-Per-Address Rule**
- Mapping tracks which addresses already have towns
- Transfer function enforces ownership limitations
- Ensures game balance and focused gameplay

**🔄 Town Account Creation**
- When town is minted, corresponding ERC-6551 account is created
- Uses deterministic address generation
- Account stores town's resources and state

**🏗️ Building Implementation**
- Buildings stored as state variables, not tokens
- Maps building types to levels for each town
- Enforces building limits based on town level
- Updates resource production rates when buildings change

**⚙️ Resource Production**
- Time-based calculation for resource accrual
- Production rates determined by building types and levels
- Storage capacity limits based on town level and storage buildings
- Collection system to mint resources to town account

## 🎨 Frontend Design

### 🖌️ Visual Style
The Town Builder employs a clean, abstract geometric style focusing on:
- 📐 Simple shapes and colors to represent buildings
- 📊 Clear resource indicators
- 🖱️ Minimalist UI for building placement

### 🧩 Core Components

#### 🏙️ Town View
- Three.js-based 3D visualization of the town
- Grid system for building placement
- Color-coded buildings by type
- Interactive camera controls
- Geometric representations of different buildings

#### 📊 Resource Dashboard
- Resource indicators with current amounts
- Progress bars showing storage capacity usage
- Production rate displays
- Collection buttons for each resource type
- Visual feedback when resources are collected

#### 🏗️ Building Menu
- Available buildings based on town level
- Resource costs clearly displayed
- Building level management interface
- Construction buttons with visual feedback
- Filtering options for different building types

### 🎭 Visual Approach

- **🏢 Buildings**: Each building type will be represented by a distinct geometric shape and color:
  - 🏛️ Town Hall: Hexagonal prism (gold)
  - 🪓 Wood Harvester: Cylindrical shape (brown)
  - ⛏️ Stone Quarry: Cubic form (gray)
  - 🔨 Metal Mine: Conical shape (silver)
  - 🌾 Farm: Low rectangular shape (green)
  - 🏪 Storage: Dome shape (blue)

- **🌳 Resources**: Resources will use consistent color coding:
  - 🪵 Wood: Brown
  - 🪨 Stone: Gray
  - ⚙️ Metal: Silver
  - 🍎 Food: Green

- **🎯 Town Grid**: A simple hexagonal or square grid showing available building plots
- **🖥️ UI Elements**: Clean, minimal interface with clear feedback on actions

## 📅 Development Roadmap

| Phase | Task | Time Estimate | Subtasks |
|-------|------|---------------|----------|
| 1️⃣ | 🚀 **Project Setup** | 1-2 hours | Foundry initialization, contract scaffolding, package setup |
| 2️⃣ | 📜 **Core Contracts** | 4-5 hours | TownNFT, ResourceToken, TownAccount implementation |
| 3️⃣ | 🎮 **Game Mechanics** | 3-4 hours | Building system, resource production, town upgrading |
| 4️⃣ | 🖥️ **Frontend Base** | 3-4 hours | React app setup, ethers.js integration, Three.js initialization |
| 5️⃣ | 🏙️ **Town Visualization** | 2-3 hours | 3D town view, building visualization, camera controls |
| 6️⃣ | 📊 **Resource UI** | 1-2 hours | Resource dashboard, production displays, collection interface |
| **Total** |  | **14-20 hours** | |

### 👥 Collaborative Development Approach

With tandem development (you managing/directing and me implementing):
- 💻 Smart contracts and frontend developed in parallel
- 🔄 Real-time feedback and adjustment
- ⚡ Optimized workflow and decision making

This approach could reduce the total development time to **10-14 hours**.

## 🔮 Future Extensions

The following features are planned for future development:

### 💰 TownCoin System (ERC-20)
- In-game currency earned by converting resources
- Implemented through a Market building
- Used for special upgrades and features

### 👑 Mayor System (ERC-721)
- Special NFTs providing town bonuses
- Different mayor types with unique abilities
- Can be purchased with TownCoin
- Transferable between towns

### 🌟 Additional Future Extensions
- 🎨 Town customization options
- 🔄 Trade system between towns
- 🏆 Special limited-time buildings
- 🏅 Achievement system
- 📊 Town leaderboards

These extensions would build upon the core architecture while adding new gameplay dimensions and showcasing additional token standards.
