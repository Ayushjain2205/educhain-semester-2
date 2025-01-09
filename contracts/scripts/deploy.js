// scripts/deploy.js
const { ethers } = require("hardhat");
const { deployContract } = require("../utils/deploy");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SageToken
  const sageToken = await deployContract("SageToken");

  // Deploy AgentRegistry
  const agentRegistry = await deployContract("AgentRegistry", [
    sageToken.address,
  ]);

  // Deploy LearningRewards
  const learningRewards = await deployContract("LearningRewards", [
    sageToken.address,
  ]);

  // Setup initial configuration
  console.log("Setting up initial configuration...");

  // Transfer tokens to LearningRewards for rewards distribution
  const rewardsAmount = ethers.utils.parseEther("10000000"); // 10M tokens
  await sageToken.transfer(learningRewards.address, rewardsAmount);
  console.log("Transferred initial rewards to LearningRewards contract");

  // Create initial achievements
  const achievements = [
    {
      name: "First Lesson Completed",
      category: "General",
      reward: ethers.utils.parseEther("10"),
      requiredProof: 1,
    },
    {
      name: "Mathematics Master",
      category: "Mathematics",
      reward: ethers.utils.parseEther("50"),
      requiredProof: 100,
    },
    {
      name: "Language Learning Pro",
      category: "Languages",
      reward: ethers.utils.parseEther("30"),
      requiredProof: 90,
    },
  ];

  for (const achievement of achievements) {
    await learningRewards.createAchievement(
      achievement.name,
      achievement.category,
      achievement.reward,
      achievement.requiredProof
    );
    console.log(`Created achievement: ${achievement.name}`);
  }

  // Print all deployment addresses
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Network: EduChain");
  console.log(`SageToken: ${sageToken.address}`);
  console.log(`AgentRegistry: ${agentRegistry.address}`);
  console.log(`LearningRewards: ${learningRewards.address}`);

  // Save deployment addresses to a file
  const deploymentInfo = {
    network: "educhain",
    chainId: 656476,
    sageToken: sageToken.address,
    agentRegistry: agentRegistry.address,
    learningRewards: learningRewards.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync("deployments.json", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
