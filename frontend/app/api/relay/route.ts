import { NextResponse } from "next/server";
import { ethers } from "ethers";

// 1. Define ABI
const ABI = [
  "function publishComplaint(uint256 merkleTreeRoot, uint256 nullifier, uint256[8] calldata points, uint256 signal, uint256 merkleTreeDepth, string calldata ipfsCid) external"
];

// 2. HARDCODE VALUES (Keep these exactly as you have them!)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!; 
const PRIVATE_KEY = process.env.METAMASK_RELAYER_PRIVATE_KEY!; 

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
    //const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/sShDu-OIPWogtVByKk1K4");
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