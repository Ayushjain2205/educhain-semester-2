// test/AgentRegistry.test.js
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("AgentRegistry", function () {
  let sageToken;
  let agentRegistry;
  let owner;
  let creator;
  let student;
  let agentRegistryAddress;

  beforeEach(async function () {
    [owner, creator, student] = await ethers.getSigners();

    // Deploy SageToken
    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.waitForDeployment();

    // Deploy AgentRegistry
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    agentRegistry = await AgentRegistry.deploy(await sageToken.getAddress());
    await agentRegistry.waitForDeployment();
    agentRegistryAddress = await agentRegistry.getAddress();

    // Setup tokens for testing
    await sageToken.transfer(creator.address, ethers.parseEther("1000"));
    await sageToken.transfer(student.address, ethers.parseEther("1000"));
    await sageToken
      .connect(creator)
      .approve(agentRegistryAddress, ethers.parseEther("1000"));
    await sageToken
      .connect(student)
      .approve(agentRegistryAddress, ethers.parseEther("1000"));
  });

  describe("Agent Registration", function () {
    it("Should register a new agent", async function () {
      await agentRegistry
        .connect(creator)
        .registerAgent("MathMaster", "Mathematics", ethers.parseEther("10"), [
          "Algebra",
          "Calculus",
        ]);

      const agent = await agentRegistry.agents(1);
      expect(agent.name).to.equal("MathMaster");
      expect(agent.creator).to.equal(creator.address);
      expect(agent.category).to.equal("Mathematics");
      expect(agent.price).to.equal(ethers.parseEther("10"));
    });

    it("Should track creator's agents", async function () {
      await agentRegistry
        .connect(creator)
        .registerAgent("MathMaster", "Mathematics", ethers.parseEther("10"), [
          "Algebra",
          "Calculus",
        ]);

      const creatorAgents = await agentRegistry.getCreatorAgents(
        creator.address
      );
      expect(creatorAgents.length).to.equal(1);
      expect(creatorAgents[0]).to.equal(1);
    });
  });

  describe("Agent Subscription", function () {
    beforeEach(async function () {
      await agentRegistry
        .connect(creator)
        .registerAgent("MathMaster", "Mathematics", ethers.parseEther("10"), [
          "Algebra",
          "Calculus",
        ]);
    });

    it("Should allow subscription to an agent", async function () {
      await agentRegistry.connect(student).subscribeToAgent(1);
      const studentAgents = await agentRegistry.getStudentAgents(
        student.address
      );
      expect(studentAgents.length).to.equal(1);
      expect(studentAgents[0]).to.equal(1);
    });

    it("Should transfer payment correctly", async function () {
      const creatorBalanceBefore = await sageToken.balanceOf(creator.address);
      await agentRegistry.connect(student).subscribeToAgent(1);
      const creatorBalanceAfter = await sageToken.balanceOf(creator.address);

      expect(creatorBalanceAfter).to.equal(
        creatorBalanceBefore + ethers.parseEther("10")
      );
    });

    it("Should increment student count", async function () {
      await agentRegistry.connect(student).subscribeToAgent(1);
      const agent = await agentRegistry.agents(1);
      expect(agent.studentsCount).to.equal(1);
    });
  });
});
