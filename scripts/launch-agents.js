// scripts/launch-agents.js
const hre = require("hardhat");
const deploymentInfo = require("../deployment.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Launching agents with account:", deployer.address);

  // Get contract instances
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const SageToken = await ethers.getContractFactory("SageToken");

  const agentRegistry = AgentRegistry.attach(
    deploymentInfo.contracts.AgentRegistry
  );
  const sageToken = SageToken.attach(deploymentInfo.contracts.SageToken);

  // Approve AgentRegistry to spend tokens for registration
  const registrationFee = ethers.parseEther("100"); // 100 SAGE tokens per agent
  await sageToken.approve(
    deploymentInfo.contracts.AgentRegistry,
    registrationFee * 5n
  );
  console.log("Approved AgentRegistry for token spending");

  // Initial Learning Agents
  const agents = [
    {
      name: "MathMaster",
      category: "Mathematics",
      price: ethers.parseEther("10"),
      specialties: ["Mental Math", "Algebra", "Calculus", "Problem Solving"],
    },
    {
      name: "FrenchTutor",
      category: "Languages",
      price: ethers.parseEther("8"),
      specialties: [
        "French Grammar",
        "Conversation",
        "Pronunciation",
        "Cultural Studies",
      ],
    },
    {
      name: "ScienceGuide",
      category: "Science",
      price: ethers.parseEther("12"),
      specialties: ["Physics", "Chemistry", "Biology", "Lab Work"],
    },
    {
      name: "CodingMentor",
      category: "Programming",
      price: ethers.parseEther("15"),
      specialties: ["Python", "JavaScript", "Algorithms", "Web Development"],
    },
    {
      name: "HistoryScholar",
      category: "History",
      price: ethers.parseEther("7"),
      specialties: [
        "World History",
        "Ancient Civilizations",
        "Modern Era",
        "Historical Analysis",
      ],
    },
  ];

  console.log("\nLaunching initial learning agents...");
  for (const agent of agents) {
    try {
      const tx = await agentRegistry.registerAgent(
        agent.name,
        agent.category,
        agent.price,
        agent.specialties
      );
      await tx.wait();
      console.log(`Launched ${agent.name} successfully!`);
    } catch (error) {
      console.error(`Error launching ${agent.name}:`, error.message);
    }
  }

  console.log("\nAll initial agents launched successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
