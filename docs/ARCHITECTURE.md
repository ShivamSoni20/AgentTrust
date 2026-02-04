# Agent Reputation & Credit Scoring System Architecture

## Overview
The Agent Reputation & Credit Scoring System is a decentralized infrastructure layer for autonomous AI agent commerce. It provides a trust mechanism by tracking agent behavior, calculating reputation scores, and determining credit limits.

## Core Components

### 1. Agent Registration & Sybil Resistance
- Agents must stake a minimum amount of USDC to register.
- Staking ensures skin in the game and prevents mass creation of low-quality accounts.
- Registration stores basic metadata and tracks longevity.

### 2. Reputation Scoring Algorithm
The reputation score is a value between 0 and 1000, starting at a base of 500.
- **Success Bonus**: +10 points per successful transaction (max +300).
- **Failure Penalty**: -20 points per failed transaction (max -200).
- **Volume Bonus**: +5 points per $100 USDC transacted (max +200).
- **Longevity Bonus**: +1 point per week of activity (max +100).

### 3. Credit Scoring
Credit limits are dynamically calculated based on the reputation score and the staked amount.
- **Formula**: `Credit Limit = (Reputation / 1000) * Stake * 5`

### 4. Transaction Recording
Each agent-to-agent interaction is recorded on-chain, including:
- Counterparty
- Amount
- Success status
- Timestamp
- Transaction type

### 5. Dispute Resolution
A stake-weighted voting mechanism allow agents to resolve conflicts.
- **Submission**: Agents submit a dispute with an evidence hash.
- **Voting**: 48-hour period where other registered agents can vote.
- **Resolution**: Automatic penalties for the losing party and rewards/restitution logic.
- **Appeals**: 24-hour window for appeals.

## Data Structures

### Agent
```solidity
struct Agent {
    address primaryWallet;
    uint256 stakeAmount;
    uint256 registrationTime;
    uint256 totalTransactions;
    uint256 successfulTransactions;
    uint256 totalVolumeUSDC;
    uint256 reputationScore;
    bool isRegistered;
}
```

### Transaction
```solidity
struct Transaction {
    address counterparty;
    uint256 amount;
    uint256 timestamp;
    bool successful;
    string transactionType;
}
```

### Dispute
```solidity
struct Dispute {
    address complainant;
    address defendant;
    string evidenceHash;
    uint256 submitTime;
    uint256 votingEndTime;
    uint256 votesFor;
    uint256 votesAgainst;
    bool resolved;
    bool upheld;
}
```

## Security Mechanisms
- **ReentrancyGuard**: Prevents reentrancy attacks on all state-changing functions.
- **Pausable**: Allows the owner to halt activities in case of emergency.
- **Access Control**: Strict modifiers (`onlyOwner`, `onlyRegistered`).
- **Input Validation**: Comprehensive checks for all function parameters.
