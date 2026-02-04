export const AGENT_REPUTATION_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_usdcToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AlreadyRegistered",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyVoted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DisputeNotActive",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientStake",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotRegistered",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UnauthorizedCaller",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "VotingPeriodEnded",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "stakeAmount",
                "type": "uint256"
            }
        ],
        "name": "AgentRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "disputeId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "upheld",
                "type": "bool"
            }
        ],
        "name": "DisputeResolved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "disputeId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "complainant",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "defendant",
                "type": "address"
            }
        ],
        "name": "DisputeSubmitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "disputeId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "voteFor",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "weight",
                "type": "uint256"
            }
        ],
        "name": "DisputeVoted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newScore",
                "type": "uint256"
            }
        ],
        "name": "ReputationUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newAmount",
                "type": "uint256"
            }
        ],
        "name": "StakeUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "counterparty",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "successful",
                "type": "bool"
            }
        ],
        "name": "TransactionRecorded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "APPEAL_PERIOD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "BASE_REPUTATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_REPUTATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "VOTING_PERIOD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "agents",
        "outputs": [
            {
                "internalType": "address",
                "name": "primaryWallet",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "stakeAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "registrationTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTransactions",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "successfulTransactions",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalVolumeUSDC",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reputationScore",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_agent",
                "type": "address"
            }
        ],
        "name": "calculateCreditScore",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_agent",
                "type": "address"
            }
        ],
        "name": "calculateReputation",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "disputeCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "disputes",
        "outputs": [
            {
                "internalType": "address",
                "name": "complainant",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "defendant",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "evidenceHash",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "submitTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "votingEndTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "votesFor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "votesAgainst",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "upheld",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_agent",
                "type": "address"
            }
        ],
        "name": "getAgent",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "primaryWallet",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "registrationTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalTransactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "successfulTransactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalVolumeUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reputationScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    }
                ],
                "internalType": "struct IAgentReputation.Agent",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_agentAddresses",
                "type": "address[]"
            }
        ],
        "name": "getAgents",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "primaryWallet",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "registrationTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalTransactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "successfulTransactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalVolumeUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reputationScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    }
                ],
                "internalType": "struct IAgentReputation.Agent[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_disputeId",
                "type": "uint256"
            }
        ],
        "name": "getDispute",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "complainant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "defendant",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "evidenceHash",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "submitTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votingEndTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votesFor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votesAgainst",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "resolved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "upheld",
                        "type": "bool"
                    }
                ],
                "internalType": "struct IAgentReputation.Dispute",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_agent",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_limit",
                "type": "uint256"
            }
        ],
        "name": "getTransactionHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "counterparty",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "successful",
                        "type": "bool"
                    },
                    {
                        "internalType": "string",
                        "name": "transactionType",
                        "type": "string"
                    }
                ],
                "internalType": "struct IAgentReputation.Transaction[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_secondaryWallet",
                "type": "address"
            }
        ],
        "name": "linkWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minimumStake",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_counterparty",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_successful",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "_txType",
                "type": "string"
            }
        ],
        "name": "recordTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_stakeAmount",
                "type": "uint256"
            }
        ],
        "name": "registerAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_disputeId",
                "type": "uint256"
            }
        ],
        "name": "resolveDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newMinimumStake",
                "type": "uint256"
            }
        ],
        "name": "setMinimumStake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_defendant",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_evidenceHash",
                "type": "string"
            }
        ],
        "name": "submitDispute",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "transactionHistory",
        "outputs": [
            {
                "internalType": "address",
                "name": "counterparty",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "successful",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "transactionType",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_additionalStake",
                "type": "uint256"
            }
        ],
        "name": "updateStake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdcToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_disputeId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_voteFor",
                "type": "bool"
            }
        ],
        "name": "voteOnDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "walletToAgent",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
