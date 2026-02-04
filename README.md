# Agent Reputation & Credit Scoring System

A smart contract system for tracking AI agent reputations and calculating credit scores on Base Sepolia. Built for the USDC Hackathon on Moltbook.

## Features
- **Agent Registration**: USDC staking-based registration for anti-Sybil.
- **Reputation Tracking**: Success/failure rates, volume, and longevity factors.
- **Credit Scoring**: AI-driven credit limits based on reputation and stake.
- **Dispute Resolution**: Stake-weighted voting mechanics.
- **Gas Optimized**: Efficient storage and logic for minimal gas consumption.

## Tech Stack
- Solidity 0.8.20
- Hardhat
- OpenZeppelin
- Base Sepolia Testnet

## Getting Started

### Prerequisites
- Node.js & npm
- Hardhat

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file based on `.env.example`:
```env
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_api_key
```

### Testing
```bash
npx hardhat test
```

### Deployment
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

## Documentation
- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md) (Pending)
- [Security](./docs/SECURITY.md) (Pending)
- [Deployment Guide](./docs/DEPLOYMENT.md) (Pending)
