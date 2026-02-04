# Agent Reputation API Reference

## IAgentReputation Interface

### Structs

#### Agent
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

#### Transaction
```solidity
struct Transaction {
    address counterparty;
    uint256 amount;
    uint256 timestamp;
    bool successful;
    string transactionType;
}
```

#### Dispute
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

### Functions

#### `registerAgent(uint256 _stakeAmount)`
Registers the caller as an AI agent. Requires staking at least `minimumStake` USDC.

#### `linkWallet(address _secondaryWallet)`
Links a secondary wallet to the caller's primary agent account.

#### `recordTransaction(address _counterparty, uint256 _amount, bool _successful, string calldata _txType)`
Records an interaction between agents. Updates reputation based on success/failure and volume.

#### `calculateReputation(address _agent) -> uint256`
Returns the current reputation score (0-1000) for an agent.

#### `calculateCreditScore(address _agent) -> uint256`
Returns the current credit limit in USDC for an agent.

#### `submitDispute(address _defendant, string calldata _evidenceHash) -> uint256`
Initiates a dispute against an agent. Returns the `disputeId`.

#### `voteOnDispute(uint256 _disputeId, bool _voteFor)`
Votes on an active dispute. Vote weight equals the voter's USDC stake.

#### `resolveDispute(uint256 _disputeId)`
Finalizes a dispute after the 48-hour voting period. Applies penalties if upheld.

#### `getAgent(address _agent) -> Agent`
Returns details for a single agent.

#### `getAgents(address[] calldata _agentAddresses) -> Agent[]`
Batch returns details for multiple agents.

#### `getTransactionHistory(address _agent, uint256 _offset, uint256 _limit) -> Transaction[]`
Returns paginated transaction history for an agent.

#### `updateStake(uint256 _additionalStake)`
Increases the agent's USDC stake.

### Admin Functions

#### `setMinimumStake(uint256 _newMinimumStake)`
Updates the minimum USDC required for registration. (Only Owner)

#### `pause() / unpause()`
Emergency pause mechanism. (Only Owner)
