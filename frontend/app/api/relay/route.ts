import { NextResponse } from "next/server";
import { ethers } from "ethers";

// 1. Define ABI
const ABI = [
  "function publishComplaint(uint256 merkleTreeRoot, uint256 nullifier, uint256[8] calldata points, uint256 signal, uint256 merkleTreeDepth, string calldata ipfsCid) external"
];

// 2. HARDCODE VALUES (Keep these exactly as you have them!)
const CONTRACT_ADDRESS = "0xbFCC4daA57F941e883aD74CeFD8A8a9591DddE10"; 
const PRIVATE_KEY = "0x1bdfe9d51e64953c39dd4d52e381540e656ccce27b73bfd591cb2e8cb9dbe5cc"; 

export async function POST(req: Request) {
  try {
    console.log("--- API START ---");
    console.log(`Target Contract: ${CONTRACT_ADDRESS}`);

    const body = await req.json();
    const { merkleTreeRoot, nullifier, points, signal, ipfsCid, merkleTreeDepth } = body;

    // 3. Data Cleaning
    if (merkleTreeDepth === undefined) throw new Error("merkleTreeDepth is missing")
    const formattedPoints = points.map((p: any) => p.toString());

    // 4. Connect
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    // 5. Send
    console.log("Sending transaction...");
    const tx = await contract.publishComplaint(
      merkleTreeRoot.toString(),
      nullifier.toString(),
      formattedPoints,
      signal.toString(),
      merkleTreeDepth.toString(),
      ipfsCid,
      { gasLimit: 6000000 }
    );

    console.log("Success! Hash:", tx.hash);
    await tx.wait();

    return NextResponse.json({ txHash: tx.hash, status: "success" });

  } catch (error: any) {
    console.error("Relay Failed:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}