const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Local Deployment to Ganache...");

  // 1. DEPLOY POSEIDON LIBRARY
  // Since we added the helper file, Hardhat now knows what "PoseidonT3" is!
  const PoseidonT3 = await ethers.getContractFactory("PoseidonT3");
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.waitForDeployment();
  const poseidonAddress = await poseidonT3.getAddress();
  
  console.log(`✅ PoseidonT3 Library deployed to: ${poseidonAddress}`);

  // 2. DEPLOY SEMAPHORE VERIFIER
  // We use the "libraries" option to prevent auto-linking errors if artifacts differ
  const SemaphoreVerifier = await ethers.getContractFactory("SemaphoreVerifier", {
     libraries: {}
  });
  const verifier = await SemaphoreVerifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  
  console.log(`✅ SemaphoreVerifier deployed to: ${verifierAddress}`);

  // 3. DEPLOY SEMAPHORE PROTOCOL
  // Link it to the Poseidon library we just deployed
  const Semaphore = await ethers.getContractFactory("Semaphore", {
    libraries: {
      PoseidonT3: poseidonAddress, 
    },
  });
  
  const semaphore = await Semaphore.deploy(verifierAddress);
  await semaphore.waitForDeployment();
  const semaphoreAddress = await semaphore.getAddress();
  
  console.log(`✅ Semaphore Protocol deployed to: ${semaphoreAddress}`);

  // 4. DEPLOY ZKWHISTLE
  const ZkWhistle = await ethers.getContractFactory("ZkWhistle");
  const zkWhistle = await ZkWhistle.deploy(semaphoreAddress);

  await zkWhistle.waitForDeployment();
  const appAddress = await zkWhistle.getAddress();

  console.log("----------------------------------------------------");
  console.log(`🎉 ZkWhistle Deployed Successfully!`);
  console.log(`📍 Contract Address: ${appAddress}`);
  console.log("----------------------------------------------------");
  console.log("--> UPDATE YOUR FRONTEND .ENV WITH THIS ADDRESS <--");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});