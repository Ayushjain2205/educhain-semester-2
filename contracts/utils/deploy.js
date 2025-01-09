// utils/deploy.js
const { ethers } = require("hardhat");

async function waitForConfirmations(tx) {
  console.log(`Waiting for confirmation... Hash: ${tx.hash}`);
  await tx.wait(2); // Wait for 2 blocks on EduChain
  console.log("Transaction confirmed");
}

async function verifyContract(address, args = []) {
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error);
  }
}

async function deployContract(contractName, args = []) {
  console.log(`Deploying ${contractName}...`);
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(...args);
  await contract.deployed();
  console.log(`${contractName} deployed to:`, contract.address);

  await waitForConfirmations(contract.deployTransaction);
  await verifyContract(contract.address, args);

  return contract;
}

module.exports = {
  waitForConfirmations,
  verifyContract,
  deployContract,
};
