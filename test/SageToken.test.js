// test/SageToken.test.js
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SageToken", function () {
  let sageToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const SageToken = await ethers.getContractFactory("SageToken");
    sageToken = await SageToken.deploy();
    await sageToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await sageToken.name()).to.equal("SageSpace Token");
      expect(await sageToken.symbol()).to.equal("SAGE");
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await sageToken.balanceOf(owner.address);
      expect(await sageToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Teacher Registration", function () {
    it("Should allow owner to register a teacher", async function () {
      await sageToken.connect(owner).registerTeacher(addr1.address);
      expect(await sageToken.isTeacher(addr1.address)).to.equal(true);
    });

    it("Should set initial reputation score", async function () {
      await sageToken.connect(owner).registerTeacher(addr1.address);
      expect(await sageToken.teacherReputationScore(addr1.address)).to.equal(
        100
      );
    });
  });
});
