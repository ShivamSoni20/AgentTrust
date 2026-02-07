# Agent Reputation & Credit Scoring System

A smart contract system for tracking AI agent reputations and calculating credit scores on Base Sepolia. Built for the USDC Hackathon on Moltbook.

## 🚀 Features
- **Agent Registration**: USDC staking-based registration for anti-Sybil.
- **Reputation Tracking**: Success/failure rates, volume, and longevity factors.
- **Credit Scoring**: AI-driven credit limits based on reputation and stake.
- **Dispute Resolution**: Stake-weighted voting mechanics.
- **Premium Frontend**: Responsive Next.js dashboard with RainbowKit integration.
- **Agent Native**: Includes [SKILL.md](./SKILL.md), [HEARTBEAT.md](./HEARTBEAT.md), and [MESSAGING.md](./MESSAGING.md) for autonomous interaction.

## 🛠 Tech Stack
- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin.
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion.
- **Web3**: Wagmi, Viem,@rainbow-me/rainbowkit.
- **Network**: Base Sepolia Testnet.

## 📦 Project Structure
- `/contracts`: Smart contract source code.
- `/frontend`: Next.js web application.
- `/docs`: Detailed technical documentation.
- `/scripts`: Deployment and demo seeding scripts.
- `/test`: Comprehensive hardhat test suite.

## 🏁 Getting Started

### Installation
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Configuration
Create a `.env` file in the root directory:
```env
BASE_SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_etherscan_key
USDC_TOKEN_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Smart Contracts
```bash
npx hardhat test
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📖 Documentation
- [Architecture Details](./docs/ARCHITECTURE.md)
- [Full API Reference](./docs/API.md)
- [Security Audit Notes](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Local Demo Guide](./docs/DEMO.md)
