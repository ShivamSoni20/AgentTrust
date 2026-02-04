// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IAgentReputation.sol";

/**
 * @title AgentReputation
 * @dev Tracks AI agent reputations, calculates credit scores, and enables trust-based commerce.
 * Part of the USDC Hackathon on Moltbook.
 */
contract AgentReputation is IAgentReputation, Ownable, Pausable, ReentrancyGuard {
    
    // State variables
    IERC20 public immutable usdcToken;
    uint256 public minimumStake = 100e6; // 100 USDC (assuming 6 decimals)
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant BASE_REPUTATION = 500;
    uint256 public constant VOTING_PERIOD = 48 hours;
    uint256 public constant APPEAL_PERIOD = 24 hours;
    
    // Mappings
    mapping(address => Agent) public agents;
    mapping(address => address) public walletToAgent; // Maps secondary wallet to primary wallet
    mapping(address => Transaction[]) public transactionHistory;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    uint256 public disputeCounter;

    /**
     * @dev Constructor sets the USDC token address and the owner.
     * @param _usdcToken Address of the USDC token on the target network.
     */
    constructor(address _usdcToken) Ownable(msg.sender) {
        if (_usdcToken == address(0)) revert InvalidAddress();
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Allows an AI agent to register by staking USDC.
     * @param _stakeAmount Amount of USDC to stake.
     */
    function registerAgent(uint256 _stakeAmount) external override whenNotPaused nonReentrant {
        if (_stakeAmount < minimumStake) revert InsufficientStake();
        if (agents[msg.sender].isRegistered) revert AlreadyRegistered();

        // Transfer USDC stake to contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), _stakeAmount);
        if (!success) revert InvalidAmount();

        agents[msg.sender] = Agent({
            primaryWallet: msg.sender,
            stakeAmount: _stakeAmount,
            registrationTime: block.timestamp,
            totalTransactions: 0,
            successfulTransactions: 0,
            totalVolumeUSDC: 0,
            reputationScore: BASE_REPUTATION,
            isRegistered: true
        });
        
        walletToAgent[msg.sender] = msg.sender;

        emit AgentRegistered(msg.sender, _stakeAmount);
    }

    /**
     * @dev Links a secondary wallet to the agent's primary wallet.
     * @param _secondaryWallet The wallet address to link.
     */
    function linkWallet(address _secondaryWallet) external whenNotPaused {
        if (!agents[msg.sender].isRegistered) revert NotRegistered();
        if (_secondaryWallet == address(0)) revert InvalidAddress();
        if (walletToAgent[_secondaryWallet] != address(0)) revert AlreadyRegistered();

        walletToAgent[_secondaryWallet] = msg.sender;
    }

    /**
     * @dev Records a transaction between two agents.
     * @param _counterparty The address of the other agent in the transaction.
     * @param _amount Transaction volume in USDC.
     * @param _successful Boolean indicating if the transaction was successful.
     * @param _txType String describing the type of transaction.
     */
    function recordTransaction(
        address _counterparty, 
        uint256 _amount, 
        bool _successful, 
        string calldata _txType
    ) external override whenNotPaused nonReentrant {
        address primary = walletToAgent[msg.sender];
        if (primary == address(0) || !agents[primary].isRegistered) revert NotRegistered();
        if (_counterparty == address(0)) revert InvalidAddress();

        Transaction memory newTx = Transaction({
            counterparty: _counterparty,
            amount: _amount,
            timestamp: block.timestamp,
            successful: _successful,
            transactionType: _txType
        });

        transactionHistory[primary].push(newTx);
        
        Agent storage agent = agents[primary];
        agent.totalTransactions += 1;
        if (_successful) {
            agent.successfulTransactions += 1;
        }
        agent.totalVolumeUSDC += _amount;
        
        // Update reputation score
        agent.reputationScore = calculateReputation(primary);

        emit TransactionRecorded(primary, _counterparty, _amount, _successful);
        emit ReputationUpdated(primary, agent.reputationScore);
    }

    /**
     * @dev Calculates the reputation score for a given agent.
     * @param _agent Address of the agent.
     * @return Reputation score (0-1000).
     */
    function calculateReputation(address _agent) public view override returns (uint256) {
        Agent storage agent = agents[_agent];
        if (!agent.isRegistered) return 0;

        uint256 score = BASE_REPUTATION;

        // 1. Success Bonus: +10 per successful transaction (max +300)
        uint256 successBonus = agent.successfulTransactions * 10;
        if (successBonus > 300) successBonus = 300;
        score += successBonus;

        // 2. Failure Penalty: -20 per failed transaction (max -200)
        uint256 failedTxs = agent.totalTransactions - agent.successfulTransactions;
        uint256 failurePenalty = failedTxs * 20;
        if (failurePenalty > 200) failurePenalty = 200;
        
        if (score > failurePenalty) {
            score -= failurePenalty;
        } else {
            score = 0;
        }

        // 3. Volume Bonus: +5 per $100 USDC volume (max +200)
        // USDC has 6 decimals
        uint256 volumeBonus = (agent.totalVolumeUSDC / 100e6) * 5;
        if (volumeBonus > 200) volumeBonus = 200;
        score += volumeBonus;

        // 4. Longevity Bonus: +1 per week active (max +100)
        uint256 weeksActive = (block.timestamp - agent.registrationTime) / 1 weeks;
        uint256 longevityBonus = weeksActive * 1;
        if (longevityBonus > 100) longevityBonus = 100;
        score += longevityBonus;

        // Cap at MAX_REPUTATION
        if (score > MAX_REPUTATION) score = MAX_REPUTATION;

        return score;
    }

    /**
     * @dev Calculates the credit score (limit) for a given agent.
     * @param _agent Address of the agent.
     * @return Credit limit in USDC.
     */
    function calculateCreditScore(address _agent) public view override returns (uint256) {
        Agent storage agent = agents[_agent];
        if (!agent.isRegistered) return 0;

        uint256 rep = calculateReputation(_agent);
        // Formula: creditLimit = (reputationScore / 1000) * stakeAmount * 5
        // Using (rep * stake * 5) / 1000 to maintain precision
        uint256 creditLimit = (rep * agent.stakeAmount * 5) / MAX_REPUTATION;
        
        return creditLimit;
    }

    /**
     * @dev Submits a dispute against another agent.
     * @param _defendant Address of the agent being disputed.
     * @param _evidenceHash IPFS/content hash of the evidence.
     * @return disputeId The unique ID of the submitted dispute.
     */
    function submitDispute(address _defendant, string calldata _evidenceHash) external override whenNotPaused nonReentrant returns (uint256) {
        if (!agents[msg.sender].isRegistered) revert NotRegistered();
        if (!agents[_defendant].isRegistered) revert NotRegistered();
        if (bytes(_evidenceHash).length == 0) revert InvalidAmount(); // Reuse or create new error

        uint256 disputeId = ++disputeCounter;
        disputes[disputeId] = Dispute({
            complainant: msg.sender,
            defendant: _defendant,
            evidenceHash: _evidenceHash,
            submitTime: block.timestamp,
            votingEndTime: block.timestamp + VOTING_PERIOD,
            votesFor: 0,
            votesAgainst: 0,
            resolved: false,
            upheld: false
        });

        emit DisputeSubmitted(disputeId, msg.sender, _defendant);
        return disputeId;
    }

    /**
     * @dev Votes on an active dispute. Vote weight depends on the voter's stake.
     * @param _disputeId ID of the dispute.
     * @param _voteFor True to uphold the dispute, false to reject.
     */
    function voteOnDispute(uint256 _disputeId, bool _voteFor) external override whenNotPaused nonReentrant {
        if (!agents[msg.sender].isRegistered) revert NotRegistered();
        
        Dispute storage dispute = disputes[_disputeId];
        if (dispute.submitTime == 0) revert InvalidAddress(); // Not exists
        if (block.timestamp > dispute.votingEndTime) revert VotingPeriodEnded();
        if (dispute.resolved) revert DisputeNotActive();
        if (hasVoted[msg.sender][_disputeId]) revert AlreadyVoted();

        uint256 weight = agents[msg.sender].stakeAmount;
        if (_voteFor) {
            dispute.votesFor += weight;
        } else {
            dispute.votesAgainst += weight;
        }

        hasVoted[msg.sender][_disputeId] = true;

        emit DisputeVoted(_disputeId, msg.sender, _voteFor, weight);
    }

    /**
     * @dev Resolves a dispute after the voting period has ended.
     * @param _disputeId ID of the dispute.
     */
    function resolveDispute(uint256 _disputeId) external override whenNotPaused nonReentrant {
        Dispute storage dispute = disputes[_disputeId];
        if (dispute.submitTime == 0) revert InvalidAddress();
        if (block.timestamp <= dispute.votingEndTime) revert DisputeNotActive(); // Voting still active
        if (dispute.resolved) revert AlreadyRegistered(); // Already resolved

        dispute.resolved = true;
        if (dispute.votesFor > dispute.votesAgainst) {
            dispute.upheld = true;
            // Penalize defendant: treated as 5 failed transactions
            Agent storage defendant = agents[dispute.defendant];
            // We don't have a direct penalty variable, but we can reduce reputation
            // Or increment totalTransactions and keep successful the same to simulate failures
            defendant.totalTransactions += 5; 
            defendant.reputationScore = calculateReputation(dispute.defendant);
        }

        emit DisputeResolved(_disputeId, dispute.upheld);
    }

    /**
     * @dev Fetches agent details.
     * @param _agent Address of the agent.
     * @return Agent struct with metadata and stats.
     */
    function getAgent(address _agent) external view override returns (Agent memory) {
        return agents[_agent];
    }

    /**
     * @dev Fetches transaction history for an agent with pagination.
     * @param _agent Address of the agent.
     * @param _offset Number of records to skip.
     * @param _limit Maximum number of records to return.
     * @return Array of Transaction structs.
     */
    function getTransactionHistory(address _agent, uint256 _offset, uint256 _limit) external view override returns (Transaction[] memory) {
        Transaction[] storage history = transactionHistory[_agent];
        uint256 historyLength = history.length;

        if (_offset >= historyLength) {
            return new Transaction[](0);
        }

        uint256 end = _offset + _limit;
        if (end > historyLength) {
            end = historyLength;
        }

        uint256 resultLength = end - _offset;
        Transaction[] memory result = new Transaction[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = history[_offset + i];
        }

        return result;
    }

    /**
     * @dev Fetches dispute details.
     * @param _disputeId ID of the dispute.
     * @return Dispute struct.
     */
    function getDispute(uint256 _disputeId) external view override returns (Dispute memory) {
        return disputes[_disputeId];
    }

    /**
     * @dev Allows an agent to increase their stake.
     * @param _additionalStake Amount of USDC to add to the stake.
     */
    function updateStake(uint256 _additionalStake) external whenNotPaused nonReentrant {
        address primary = walletToAgent[msg.sender];
        if (primary == address(0) || !agents[primary].isRegistered) revert NotRegistered();
        if (_additionalStake == 0) revert InvalidAmount();

        bool success = usdcToken.transferFrom(msg.sender, address(this), _additionalStake);
        if (!success) revert InvalidAmount();

        agents[primary].stakeAmount += _additionalStake;
        
        emit StakeUpdated(primary, agents[primary].stakeAmount);
    }

    /**
     * @dev Batch fetch agent details.
     * @param _agentAddresses Array of agent addresses.
     * @return Array of Agent structs.
     */
    function getAgents(address[] calldata _agentAddresses) external view returns (Agent[] memory) {
        uint256 len = _agentAddresses.length;
        Agent[] memory result = new Agent[](len);
        for (uint256 i = 0; i < len; i++) {
            result[i] = agents[_agentAddresses[i]];
        }
        return result;
    }

    /**
     * @dev Allows owner to update minimum stake requirement.
     * @param _newMinimumStake New minimum stake amount in USDC.
     */
    function setMinimumStake(uint256 _newMinimumStake) external onlyOwner {
        minimumStake = _newMinimumStake;
    }

    /**
     * @dev Emergency pause.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Emergency unpause.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
