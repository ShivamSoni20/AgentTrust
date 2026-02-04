const hre = require("hardhat");

async function main() {
    const [owner, agent1, agent2] = await hre.ethers.getSigners();

    // Update these addresses after local deployment
    const REPUTATION_ADDR = "";
    const USDC_ADDR = "";

    if (!REPUTATION_ADDR || !USDC_ADDR) {
        console.log("Please update REPUTATION_ADDR and USDC_ADDR in logic.");
        return;
    }

    const reputation = await hre.ethers.getContractAt("AgentReputation", REPUTATION_ADDR);
    const usdc = await hre.ethers.getContractAt("MockUSDC", USDC_ADDR);

    console.log("Seeding demo data...");

    const amount = hre.ethers.parseUnits("500", 6);

    // 1. Mint & Register Agent 1
    await usdc.mint(agent1.address, amount);
    await usdc.connect(agent1).approve(REPUTATION_ADDR, amount);
    await reputation.connect(agent1).registerAgent(amount);
    console.log("Agent 1 Registered with 500 USDC stake.");

    // 2. Record successful transactions
    for (let i = 0; i < 5; i++) {
        await reputation.connect(agent1).recordTransaction(agent2.address, hre.ethers.parseUnits("100", 6), true, "service-call");
        console.log(`Recorded successful transaction ${i + 1}`);
    }

    // 3. Record one failed transaction
    await reputation.connect(agent1).recordTransaction(agent2.address, hre.ethers.parseUnits("50", 6), false, "failed-api");
    console.log("Recorded 1 failed transaction.");

    const agentInfo = await reputation.getAgent(agent1.address);
    console.log("Initial Rep:", agentInfo.reputationScore.toString());

    console.log("Demo seeding complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
