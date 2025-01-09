// test/LearningRewards.test.js
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("LearningRewards", function () {
  let sageToken;
  let learningRewards;
  let owner;
  let agent;
  let student;
  let learningRewardsAddress;

  beforeEach(async function () {
    [owner, agent, student] = await ethers.getSigners();

    // Deploy SageToken
    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.waitForDeployment();

    // Deploy LearningRewards
    const LearningRewards = await ethers.getContractFactory("LearningRewards");
    learningRewards = await LearningRewards.deploy(
      await sageToken.getAddress()
    );
    await learningRewards.waitForDeployment();
    learningRewardsAddress = await learningRewards.getAddress();

    // Fund rewards contract
    await sageToken.transfer(
      learningRewardsAddress,
      ethers.parseEther("10000")
    );
  });

  describe("Agent Management", function () {
    it("Should allow owner to authorize agent", async function () {
      await learningRewards.authorizeAgent(agent.address);
      expect(await learningRewards.authorizedAgents(agent.address)).to.be.true;
    });

    it("Should allow owner to deauthorize agent", async function () {
      await learningRewards.authorizeAgent(agent.address);
      await learningRewards.deauthorizeAgent(agent.address);
      expect(await learningRewards.authorizedAgents(agent.address)).to.be.false;
    });

    it("Should prevent non-owner from authorizing agents", async function () {
      await expect(
        learningRewards.connect(agent).authorizeAgent(agent.address)
      ).to.be.revertedWithCustomError(
        learningRewards,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Achievements", function () {
    beforeEach(async function () {
      await learningRewards.authorizeAgent(agent.address);
      await learningRewards.createAchievement(
        "Math Master",
        "Mathematics",
        ethers.parseEther("10"),
        80
      );
    });

    it("Should create achievement correctly", async function () {
      const achievement = await learningRewards.achievements(1);
      expect(achievement.name).to.equal("Math Master");
      expect(achievement.category).to.equal("Mathematics");
      expect(achievement.rewardAmount).to.equal(ethers.parseEther("10"));
      expect(achievement.requiredProof).to.equal(80);
    });

    it("Should allow authorized agent to complete achievement", async function () {
      await learningRewards
        .connect(agent)
        .completeAchievement(student.address, 1, 85);

      const [totalRewards, achievementsCompleted] =
        await learningRewards.getStudentProgress(student.address);
      expect(totalRewards).to.equal(ethers.parseEther("10"));
      expect(achievementsCompleted).to.equal(1);
    });

    it("Should transfer rewards on achievement completion", async function () {
      const beforeBalance = await sageToken.balanceOf(student.address);
      await learningRewards
        .connect(agent)
        .completeAchievement(student.address, 1, 85);
      const afterBalance = await sageToken.balanceOf(student.address);

      expect(afterBalance).to.equal(beforeBalance + ethers.parseEther("10"));
    });

    it("Should prevent double completion of achievements", async function () {
      await learningRewards
        .connect(agent)
        .completeAchievement(student.address, 1, 85);

      await expect(
        learningRewards
          .connect(agent)
          .completeAchievement(student.address, 1, 90)
      ).to.be.revertedWith("Achievement already completed");
    });
  });
});
