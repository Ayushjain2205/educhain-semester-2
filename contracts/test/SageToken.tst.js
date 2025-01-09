// test/SageToken.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SageToken", function () {
  let sageToken;
  let owner;
  let teacher;
  let addr1;

  beforeEach(async function () {
    [owner, teacher, addr1] = await ethers.getSigners();
    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sageToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await sageToken.balanceOf(owner.address);
      expect(await sageToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Teacher Registration", function () {
    it("Should register a teacher", async function () {
      await sageToken.registerTeacher(teacher.address);
      expect(await sageToken.isTeacher(teacher.address)).to.equal(true);
      expect(await sageToken.teacherReputationScore(teacher.address)).to.equal(
        100
      );
    });

    it("Should not allow registering same teacher twice", async function () {
      await sageToken.registerTeacher(teacher.address);
      await expect(
        sageToken.registerTeacher(teacher.address)
      ).to.be.revertedWith("Already registered as teacher");
    });
  });
});

// test/AgentRegistry.test.js
describe("AgentRegistry", function () {
  let sageToken;
  let agentRegistry;
  let owner;
  let creator;
  let student;

  beforeEach(async function () {
    [owner, creator, student] = await ethers.getSigners();

    // Deploy SageToken
    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.deployed();

    // Deploy AgentRegistry
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    agentRegistry = await AgentRegistry.deploy(sageToken.address);
    await agentRegistry.deployed();

    // Transfer some tokens to creator and student
    await sageToken.transfer(creator.address, ethers.utils.parseEther("1000"));
    await sageToken.transfer(student.address, ethers.utils.parseEther("1000"));

    // Approve spending
    await sageToken
      .connect(creator)
      .approve(agentRegistry.address, ethers.utils.parseEther("1000"));
    await sageToken
      .connect(student)
      .approve(agentRegistry.address, ethers.utils.parseEther("1000"));
  });

  describe("Agent Registration", function () {
    it("Should register a new agent", async function () {
      await agentRegistry
        .connect(creator)
        .registerAgent(
          "MathMaster",
          "Mathematics",
          ethers.utils.parseEther("10"),
          ["Algebra", "Calculus"]
        );

      const agent = await agentRegistry.agents(1);
      expect(agent.name).to.equal("MathMaster");
      expect(agent.creator).to.equal(creator.address);
    });
  });
});

// test/LearningRewards.test.js
describe("LearningRewards", function () {
  let sageToken;
  let learningRewards;
  let owner;
  let agent;
  let student;

  beforeEach(async function () {
    [owner, agent, student] = await ethers.getSigners();

    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.deployed();

    const LearningRewards = await ethers.getContractFactory("LearningRewards");
    learningRewards = await LearningRewards.deploy(sageToken.address);
    await learningRewards.deployed();

    // Fund rewards contract
    await sageToken.transfer(
      learningRewards.address,
      ethers.utils.parseEther("10000")
    );

    // Authorize agent
    await learningRewards.authorizeAgent(agent.address);
  });

  describe("Achievements", function () {
    beforeEach(async function () {
      await learningRewards.createAchievement(
        "First Math Test",
        "Mathematics",
        ethers.utils.parseEther("10"),
        80
      );
    });

    it("Should complete achievement and reward student", async function () {
      await learningRewards
        .connect(agent)
        .completeAchievement(student.address, 1, 85);

      const progress = await learningRewards.getStudentProgress(
        student.address
      );
      expect(progress.achievementsCompleted).to.equal(1);
      expect(await sageToken.balanceOf(student.address)).to.equal(
        ethers.utils.parseEther("10")
      );
    });
  });
});
