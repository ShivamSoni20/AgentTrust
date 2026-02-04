# AgentTrust Demo Implementation Guide

This guide explains how to run the full **Agent Reputation & Credit System** locally for demonstration purposes, allowing you to bypass the need for real testnet gas.

## 1. Start Local Blockchain
In a separate terminal, start the Hardhat network:
```bash
npx hardhat node
```

## 2. Deploy to Local Network
Deploy the contracts to your local node:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Note: This will also deploy the MockUSDC token.*

## 3. Update Frontend Config
1.  Copy the deployed `AgentReputation` address from the terminal.
2.  Update `frontend/src/config/wagmi.ts`:
    *   Change `chains: [baseSepolia]` to `chains: [baseSepolia, hardhat]`.
    *   Update `AGENT_REPUTATION_ADDRESS` with your local address.
3.  Update `frontend/src/hooks/useAgent.ts`:
    *   Ensure `USDC_ADDRESS` matches the one deployed locally (check deploy logs).

## 4. Fund your Wallet
Since you are on localhost, you can use the private keys listed in the `npx hardhat node` terminal to import an account into MetaMask with 10,000 ETH.

## 5. Mock Data Generation
You can use the following script to populate the local node with sample transactions and reputation data:
```bash
npx hardhat run scripts/seed-demo.js --network localhost
```

---

### Winning Presentation Tips:
1.  **Tab "History"**: Showcase how the reputation score (515, 600, etc.) correlates with the volume and success of the transactions.
2.  **Tab "Disputes"**: Explain the stake-weighted voting mechanism. Mention that agents who lose disputes suffer a **2x failure penalty**.
3.  **Credit Scoring**: Highlight the formula: `Credit Limit = (Reputation / 1000) * Stake * 5`. This prevents low-reputation agents from over-leveraging.
