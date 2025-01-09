// scripts/distribute-tokens.js
const hre = require("hardhat");
const deploymentInfo = require("../deployment.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Distributing tokens with account:", deployer.address);

  // Initial supporters
  const initialSupporters = [
    "0xFDBF653ABFcD6b8D985BE00380D0a282A67CC212",
    "0x253F91e579C5260059804e6ac9057C92aD8B86b7",
    "0xa482AE7d753b33cB06Fd6872443E902cB6BEe592",
    "0xBe46A6c57aB6d9272b5674C47fe587Dd3B5B54Db",
  ];

  // Get contract instances
  const SageToken = await ethers.getContractFactory("SageToken");
  const LearningRewards = await ethers.getContractFactory("LearningRewards");

  const sageToken = SageToken.attach(deploymentInfo.contracts.SageToken);
  const learningRewards = LearningRewards.attach(
    deploymentInfo.contracts.LearningRewards
  );

  // Token distribution amounts
  const tokenAmount = ethers.parseEther("10000"); // 10,000 SAGE tokens per supporter
  const rewardsAmount = ethers.parseEther("5000"); // 5,000 SAGE tokens for initial achievements

  console.log("\nDistributing tokens to initial supporters...");
  for (const supporter of initialSupporters) {
    try {
      const tx = await sageToken.transfer(supporter, tokenAmount);
      await tx.wait();
      console.log(
        `Transferred ${ethers.formatEther(tokenAmount)} SAGE to ${supporter}`
      );
    } catch (error) {
      console.error(`Error transferring to ${supporter}:`, error.message);
    }
  }

  // Setup initial learning achievements with rewards
  console.log("\nSetting up initial learning achievements...");
  const achievements = [
    {
      name: "Early Supporter Achievement",
      category: "Community",
      reward: ethers.parseEther("100"),
      requiredProof: 1,
    },
    {
      name: "First Learning Session",
      category: "General",
      reward: ethers.parseEther("50"),
      requiredProof: 1,
    },
    {
      name: "Community Builder",
      category: "Social",
      reward: ethers.parseEther("200"),
      requiredProof: 5,
    },
  ];

  // Transfer tokens to LearningRewards contract for achievement rewards
  console.log("\nFunding LearningRewards contract...");
  try {
    const tx = await sageToken.transfer(
      deploymentInfo.contracts.LearningRewards,
      rewardsAmount
    );
    await tx.wait();
    console.log(
      `Transferred ${ethers.formatEther(
        rewardsAmount
      )} SAGE to LearningRewards contract`
    );
  } catch (error) {
    console.error("Error funding rewards:", error.message);
  }

  // Create achievements
  console.log("\nCreating achievements...");
  for (const achievement of achievements) {
    try {
      const tx = await learningRewards.createAchievement(
        achievement.name,
        achievement.category,
        achievement.reward,
        achievement.requiredProof
      );
      await tx.wait();
      console.log(`Created achievement: ${achievement.name}`);
    } catch (error) {
      console.error(
        `Error creating achievement ${achievement.name}:`,
        error.message
      );
    }
  }

  // Authorize initial supporters as learning agents
  console.log("\nAuthorizing initial supporters as learning agents...");
  for (const supporter of initialSupporters) {
    try {
      const tx = await learningRewards.authorizeAgent(supporter);
      await tx.wait();
      console.log(`Authorized ${supporter} as learning agent`);
    } catch (error) {
      console.error(`Error authorizing ${supporter}:`, error.message);
    }
  }

  console.log("\nToken distribution and setup completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
