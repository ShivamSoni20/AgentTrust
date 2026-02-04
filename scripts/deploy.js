const hre = require("hardhat");

async function main() {
    console.log("Deploying AgentReputation...");

    // For testing on Base Sepolia, you might want to use the actual USDC address
    // or deploy a mock if it's a fresh test environment.
    // Base Sepolia USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e (example)
    let usdcAddress = process.env.USDC_TOKEN_ADDRESS;

    if (!usdcAddress && hre.network.name !== "base-sepolia") {
        const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
        const mockUsdc = await MockUSDC.deploy();
        await mockUsdc.waitForDeployment();
        usdcAddress = await mockUsdc.getAddress();
        console.log("Mock USDC deployed to:", usdcAddress);
    }

    if (!usdcAddress) {
        throw new Error("USDC address not provided for non-local network");
    }

    const AgentReputation = await hre.ethers.getContractFactory("AgentReputation");
    const agentReputation = await AgentReputation.deploy(usdcAddress);

    await agentReputation.waitForDeployment();

    console.log("AgentReputation deployed to:", await agentReputation.getAddress());
    console.log("USDC address:", usdcAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
