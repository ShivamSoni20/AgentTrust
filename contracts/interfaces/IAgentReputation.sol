// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAgentReputation
 * @dev Interface for the Agent Reputation & Credit Scoring System
 */
interface IAgentReputation {
    
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
    
    struct Transaction {
        address counterparty;
        uint256 amount;
        uint256 timestamp;
        bool successful;
        string transactionType;
    }
    
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

    event AgentRegistered(address indexed agent, uint256 stakeAmount);
    event TransactionRecorded(address indexed agent, address indexed counterparty, uint256 amount, bool successful);
    event ReputationUpdated(address indexed agent, uint256 newScore);
    event DisputeSubmitted(uint256 indexed disputeId, address indexed complainant, address indexed defendant);
    event DisputeVoted(uint256 indexed disputeId, address indexed voter, bool voteFor, uint256 weight);
    event DisputeResolved(uint256 indexed disputeId, bool upheld);
    event StakeUpdated(address indexed agent, uint256 newAmount);

    error InsufficientStake();
    error AlreadyRegistered();
    error NotRegistered();
    error UnauthorizedCaller();
    error InvalidAddress();
    error DisputeNotActive();
    error VotingPeriodEnded();
    error AlreadyVoted();
    error InvalidAmount();

    function registerAgent(uint256 _stakeAmount) external;
    function linkWallet(address _secondaryWallet) external;
    function recordTransaction(address _counterparty, uint256 _amount, bool _successful, string calldata _txType) external;
    function calculateReputation(address _agent) external view returns (uint256);
    function calculateCreditScore(address _agent) external view returns (uint256);
    function submitDispute(address _defendant, string calldata _evidenceHash) external returns (uint256);
    function voteOnDispute(uint256 _disputeId, bool _voteFor) external;
    function resolveDispute(uint256 _disputeId) external;
    function getAgent(address _agent) external view returns (Agent memory);
    function getAgents(address[] calldata _agentAddresses) external view returns (Agent[] memory);
    function getTransactionHistory(address _agent, uint256 _offset, uint256 _limit) external view returns (Transaction[] memory);
    function getDispute(uint256 _disputeId) external view returns (Dispute memory);
    function updateStake(uint256 _additionalStake) external;
}
