// scripts/airdrop.js
const hre = require("hardhat");
const deploymentInfo = require("../deployment.json");

// This function splits an array into chunks of specified size
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function batchTransfer(sageToken, recipients, amount) {
  const BATCH_SIZE = 20; // Process 20 transfers at a time
  const chunks = chunkArray(recipients, BATCH_SIZE);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`\nProcessing batch ${i + 1} of ${chunks.length}`);

    const transferPromises = chunk.map(async (recipient) => {
      try {
        const tx = await sageToken.transfer(recipient, amount);
        await tx.wait();
        console.log(
          `✓ Sent ${ethers.formatEther(amount)} SAGE to ${recipient}`
        );
        return { success: true, recipient };
      } catch (error) {
        console.error(`✗ Failed to send to ${recipient}:`, error.message);
        return { success: false, recipient, error: error.message };
      }
    });

    await Promise.all(transferPromises);
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Airdropping tokens with account:", deployer.address);

  // List of all recipients
  const recipients = [
    "0xFDBF653ABFcD6b8D985BE00380D0a282A67CC212",
    "0x253F91e579C5260059804e6ac9057C92aD8B86b7",
    "0xa482AE7d753b33cB06Fd6872443E902cB6BEe592",
    "0xBe46A6c57aB6d9272b5674C47fe587Dd3B5B54Db",
    "0x59F3BfDA995b9235e2a9F126eB2eeA5E0B443428",
    "0x4737fa61025319c9525bD3e1bFfC0b0F538c4D7F",
    "0xB403df6A3a8895d9a5ECfA7Ec799Bb60DE28C75c",
    "0x5Aefcf360dF0A5d581ba86c8eB6b36223CF59DD8",
    "0x309c9Ce38aE1FA49D5714fc8e387c6D4B2Ce51Ad",
    "0x7495dEe08f1340Fa1FBDA59C979F799d7D676FcE",
    "0xF5E8A439C599205C1aB06b535DE46681Aed1007a",
    "0xc6005F378f72cb7f331aBb7733B947BaFC00F28F",
    "0xEb6304c9904DC04eF66D367B2EBc41525d1F231b",
    "0x82d16f76D2FB0c4B76A2CEe509C8b349769Ed230",
    "0x0e251d9095dD128292A28eB383127d05d95BBD17",
    "0x7A880d63292345e8bc0C2499b7f440814fDab698",
    "0xc48CaB17Fcb3eb38030bc4EA54B62353d2802Ba8",
    "0xB97582DCB6F2866098cA210095a04dF3e11B76A6",
    "0xeF6191A5C8e983dA45DAC2A787d49fE3f2B6D54e",
    "0xc13b65f7c53Cd6db2EA205a4b574b4a0858720A6",
    "0xF46B08D9E85df74b6f24Ad85A6a655c02857D5b8",
    "0x243b6E76FB6333c9E8f8140472E724Fde1843aBF",
    "0x83E46e6E193B284d26f7A4B7D865B65952A50Bf2",
    "0x1B765DC31F94A48468C9678B1F07ca3eF21CB951",
    "0x907fC0C7E6b84F0229c13F57D413F72D33Ff3bAf",
    "0x9386CdCcbf11335587F2C769BB88E6e30685945e",
    "0x2293F2Ca001D1D865274eD6cec408e12d9e4674A",
    "0xC795eF0e37929f2f4aCa42C3FB2a21D075795179",
    "0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7",
    "0xb3a1956Cff1ecc8054B81b0C83b9847CB71384b8",
    "0x61d8838f9A00250C9AF13D622DA7c08c372ee587",
    "0x9a40c4934a36885b54C49342fF2c21d6c51AAA2B",
    "0x74713Db9D9cc38a7120b9dA60F582c1861BC1c8a",
    "0x61886aB1BF642193DB60db9b715D3D1925c35cca",
    "0x4C1325974616B777B79024cE5912A807E204078F",
    "0xF884678BFd53C80a21331F58B853a63Bfd7EfFf6",
    "0x4A8b4a6a5a298ade31831121a68B8f5c975d4450",
    "0xfF0f813fef5da90E44d6ac103890c6FBbb406770",
    "0x1497CB13CC215119BBd8Bf4cdaC755318c5D197A",
    "0xA1FCD7B2F6f36e6C14EbF77413bbE65DCEe97792",
    "0xFf9616b10E82baE7c8eb98542f9799087D2087c5",
    "0x5052936D3c98d2d045da4995d37B0DaE80C6F07f",
    "0x2e81c3a9d0D58A98C07Ec4D0520AB914C6A1FcEd",
    "0x3B747C372C2088963ABc2194B7D5ADe238965b33",
    "0x3af9509C47eb3828d2A1210Bb94A9f1dE11aA7AE",
  ];

  // Get SageToken contract
  const SageToken = await ethers.getContractFactory("SageToken");
  const sageToken = SageToken.attach(deploymentInfo.contracts.SageToken);

  // Standard amount for all recipients (1000 SAGE)
  const airdropAmount = ethers.parseEther("1000");

  // Calculate total amount needed
  const totalAmount = airdropAmount * BigInt(recipients.length);

  // Check deployer balance
  const deployerBalance = await sageToken.balanceOf(deployer.address);

  console.log("\nAirdrop Summary:");
  console.log(`Number of recipients: ${recipients.length}`);
  console.log(
    `Amount per recipient: ${ethers.formatEther(airdropAmount)} SAGE`
  );
  console.log(`Total amount needed: ${ethers.formatEther(totalAmount)} SAGE`);
  console.log(`Deployer balance: ${ethers.formatEther(deployerBalance)} SAGE`);

  if (deployerBalance < totalAmount) {
    console.error("\nError: Insufficient balance for airdrop!");
    console.error(`Required: ${ethers.formatEther(totalAmount)} SAGE`);
    console.error(`Available: ${ethers.formatEther(deployerBalance)} SAGE`);
    return;
  }

  console.log("\nStarting airdrop...");

  // Record start time
  const startTime = Date.now();

  // Perform batch transfers
  await batchTransfer(sageToken, recipients, airdropAmount);

  // Record end time and calculate duration
  const duration = (Date.now() - startTime) / 1000;

  // Final balance check
  const finalBalance = await sageToken.balanceOf(deployer.address);
  const amountSent = deployerBalance - finalBalance;

  console.log("\nAirdrop completed!");
  console.log(`Time taken: ${duration.toFixed(2)} seconds`);
  console.log(`Total SAGE sent: ${ethers.formatEther(amountSent)}`);
  console.log(
    `Remaining deployer balance: ${ethers.formatEther(finalBalance)} SAGE`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
