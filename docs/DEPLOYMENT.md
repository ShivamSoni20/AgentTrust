# Deployment Guide

## Network Information
- **Network Name**: Base Sepolia
- **Chain ID**: 84532
- **Currency**: ETH (for gas)
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: `https://sepolia.basescan.org`
- **Official USDC (Base Sepolia)**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## Prerequisites
1. **Wallet**: An Ethereum wallet (e.g., MetaMask) with Base Sepolia ETH.
2. **Environment**:
   - `PRIVATE_KEY`: Your deployment wallet private key.
   - `BASESCAN_API_KEY`: For contract verification.
   - `USDC_TOKEN_ADDRESS`: Set to `0x036CbD53842c5426634e7929541eC2318f3dCF7e` for Base Sepolia.

## Step-by-Step Deployment

### 1. Configure Environment
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Run Tests
Ensure all 115+ test cases pass:
```bash
npx hardhat test
```

### 4. Deploy to Base Sepolia
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### 5. Verify on BaseScan
```bash
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> <USDC_ADDRESS>
```

## Post-Deployment
1. Update your frontend with the new `AgentReputation` address.
2. Initialize the contract with any necessary parameters if needed.
3. Perform a test registration and transaction to verify everything is working.
