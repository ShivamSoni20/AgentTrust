const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("AgentReputation Complete Test Suite", function () {
    const MIN_STAKE = ethers.parseUnits("100", 6);
    const BASE_REP = 500n;

    async function deployFixture() {
        const [owner, agent1, agent2, agent3, other] = await ethers.getSigners();
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        const mockUsdc = await MockUSDC.deploy();
        const AgentReputation = await ethers.getContractFactory("AgentReputation");
        const reputation = await AgentReputation.deploy(await mockUsdc.getAddress());
        return { reputation, mockUsdc, owner, agent1, agent2, agent3, other };
    }

    async function registerAgent(reputation, mockUsdc, account, stake = MIN_STAKE) {
        await mockUsdc.mint(account.address, stake);
        await mockUsdc.connect(account).approve(await reputation.getAddress(), stake);
        await reputation.connect(account).registerAgent(stake);
    }

    describe("1. Initialization & Ownership", function () {
        it("should initialize with correct USDC token", async function () {
            const { reputation, mockUsdc } = await loadFixture(deployFixture);
            expect(await reputation.usdcToken()).to.equal(await mockUsdc.getAddress());
        });

        it("should set the deployer as owner", async function () {
            const { reputation, owner } = await loadFixture(deployFixture);
            expect(await reputation.owner()).to.equal(owner.address);
        });

        it("should revert if initialized with zero address", async function () {
            const AgentReputation = await ethers.getContractFactory("AgentReputation");
            await expect(AgentReputation.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(AgentReputation, "InvalidAddress");
        });
    });

    describe("2. Agent Registration", function () {
        it("should register successfully with minimum stake", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            const agent = await reputation.getAgent(agent1.address);
            expect(agent.isRegistered).to.be.true;
            expect(agent.stakeAmount).to.equal(MIN_STAKE);
            expect(agent.reputationScore).to.equal(BASE_REP);
        });

        it("should revert if staking less than minimum", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            const lowStake = MIN_STAKE - 1n;
            await mockUsdc.mint(agent1.address, lowStake);
            await mockUsdc.connect(agent1).approve(await reputation.getAddress(), lowStake);
            await expect(reputation.connect(agent1).registerAgent(lowStake)).to.be.revertedWithCustomError(reputation, "InsufficientStake");
        });

        it("should revert if already registered", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await expect(reputation.connect(agent1).registerAgent(MIN_STAKE)).to.be.revertedWithCustomError(reputation, "AlreadyRegistered");
        });
    });

    describe("3. Wallet Linking", function () {
        it("should link a secondary wallet", async function () {
            const { reputation, mockUsdc, agent1, other } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await reputation.connect(agent1).linkWallet(other.address);
            expect(await reputation.walletToAgent(other.address)).to.equal(agent1.address);
        });

        it("should revert if linking to a zero address", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await expect(reputation.connect(agent1).linkWallet(ethers.ZeroAddress)).to.be.revertedWithCustomError(reputation, "InvalidAddress");
        });

        it("should revert if wallet is already linked", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            await expect(reputation.connect(agent1).linkWallet(agent2.address)).to.be.revertedWithCustomError(reputation, "AlreadyRegistered");
        });
    });

    describe("4. Transaction Recording & Reputation", function () {
        it("should record transaction from primary wallet", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await reputation.connect(agent1).recordTransaction(agent2.address, MIN_STAKE, true, "service");
            const agent = await reputation.getAgent(agent1.address);
            expect(agent.totalTransactions).to.equal(1);
        });

        it("should record transaction from secondary wallet", async function () {
            const { reputation, mockUsdc, agent1, agent2, other } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await reputation.connect(agent1).linkWallet(other.address);
            await reputation.connect(other).recordTransaction(agent2.address, MIN_STAKE, true, "service");
            const agent = await reputation.getAgent(agent1.address);
            expect(agent.totalTransactions).to.equal(1);
        });

        it("should calculate reputation correctly (success + volume)", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            const amount = ethers.parseUnits("100", 6);
            await reputation.connect(agent1).recordTransaction(agent2.address, amount, true, "tx");
            // Base 500 + 10 (success) + 5 (volume 100) = 515
            expect(await reputation.calculateReputation(agent1.address)).to.equal(515n);
        });

        it("should apply failure penalty", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await reputation.connect(agent1).recordTransaction(agent2.address, 0, false, "tx");
            // Base 500 - 20 (penalty) = 480
            expect(await reputation.calculateReputation(agent1.address)).to.equal(480n);
        });

        it("should cap reputation at 1000", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            for (let i = 0; i < 40; i++) {
                await reputation.connect(agent1).recordTransaction(agent2.address, ethers.parseUnits("500", 6), true, "tx");
            }
            expect(await reputation.calculateReputation(agent1.address)).to.equal(1000n);
        });
    });

    describe("5. Credit Scoring", function () {
        it("should calculate credit limit based on reputation and stake", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            const stake = ethers.parseUnits("200", 6);
            await registerAgent(reputation, mockUsdc, agent1, stake);
            // Rep 500, Stake 200 -> (500/1000) * 200 * 5 = 500
            expect(await reputation.calculateCreditScore(agent1.address)).to.equal(ethers.parseUnits("500", 6));
        });
    });

    describe("6. Dispute Resolution", function () {
        it("should allow submitting a dispute", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            await reputation.connect(agent1).submitDispute(agent2.address, "ipfs://evidence");
            const dispute = await reputation.getDispute(1);
            expect(dispute.complainant).to.equal(agent1.address);
        });

        it("should weight votes by stake", async function () {
            const { reputation, mockUsdc, agent1, agent2, agent3 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1, MIN_STAKE);
            await registerAgent(reputation, mockUsdc, agent2, MIN_STAKE);
            await registerAgent(reputation, mockUsdc, agent3, MIN_STAKE * 2n);

            await reputation.connect(agent1).submitDispute(agent2.address, "hash");
            await reputation.connect(agent1).voteOnDispute(1, true);
            await reputation.connect(agent3).voteOnDispute(1, false);

            const dispute = await reputation.getDispute(1);
            expect(dispute.votesFor).to.equal(MIN_STAKE);
            expect(dispute.votesAgainst).to.equal(MIN_STAKE * 2n);
        });

        it("should revert vote if already voted", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            await reputation.connect(agent1).submitDispute(agent2.address, "hash");
            await reputation.connect(agent1).voteOnDispute(1, true);
            await expect(reputation.connect(agent1).voteOnDispute(1, true)).to.be.revertedWithCustomError(reputation, "AlreadyVoted");
        });

        it("should revert resolve if voting period not ended", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            await reputation.connect(agent1).submitDispute(agent2.address, "hash");
            await expect(reputation.resolveDispute(1)).to.be.revertedWithCustomError(reputation, "DisputeNotActive");
        });

        it("should apply penalty if dispute is upheld", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            await reputation.connect(agent1).submitDispute(agent2.address, "hash");
            await reputation.connect(agent1).voteOnDispute(1, true);

            await ethers.provider.send("evm_increaseTime", [48 * 3600 + 1]);
            await reputation.resolveDispute(1);

            const defendant = await reputation.getAgent(agent2.address);
            expect(defendant.reputationScore).to.be.lessThan(500n);
        });
    });

    describe("7. Queries & Admin", function () {
        it("should return batch agent details", async function () {
            const { reputation, mockUsdc, agent1, agent2 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await registerAgent(reputation, mockUsdc, agent2);
            const agents = await reputation.getAgents([agent1.address, agent2.address]);
            expect(agents.length).to.equal(2);
            expect(agents[0].primaryWallet).to.equal(agent1.address);
        });

        it("should allow increasing stake", async function () {
            const { reputation, mockUsdc, agent1 } = await loadFixture(deployFixture);
            await registerAgent(reputation, mockUsdc, agent1);
            await mockUsdc.mint(agent1.address, MIN_STAKE);
            await mockUsdc.connect(agent1).approve(await reputation.getAddress(), MIN_STAKE);
            await reputation.connect(agent1).updateStake(MIN_STAKE);
            const agent = await reputation.getAgent(agent1.address);
            expect(agent.stakeAmount).to.equal(MIN_STAKE * 2n);
        });

        it("should allow owner to set minimum stake", async function () {
            const { reputation, owner } = await loadFixture(deployFixture);
            await reputation.connect(owner).setMinimumStake(1000);
            expect(await reputation.minimumStake()).to.equal(1000n);
        });

        it("should enforce pause", async function () {
            const { reputation, owner, agent1 } = await loadFixture(deployFixture);
            await reputation.connect(owner).pause();
            await expect(reputation.connect(agent1).registerAgent(MIN_STAKE)).to.be.revertedWithCustomError(reputation, "EnforcedPause");
        });
    });
});
