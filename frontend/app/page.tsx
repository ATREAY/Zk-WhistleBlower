"use client";
import { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { ethers } from "ethers";
import axios from "axios";

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xbFCC4daA57F941e883aD74CeFD8A8a9591DddE10"; 

const ABI = [
  "function joinGroup(uint256 identityCommitment) external",
  "function groupId() view returns (uint256)",
  "event NewComplaint(uint256 indexed signal, string ipfsCid)",
  "event GroupCreated(uint256 indexed groupId, address indexed admin)"
];

export default function Home() {
  // --- STATE ---
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [status, setStatus] = useState("Waiting for action...");
  const [complaint, setComplaint] = useState("");
  
  // FIXED: Use 'any[]' so TypeScript stops yelling about 'id' vs 'msg'
  const [logs, setLogs] = useState<any[]>([]);
  
  // NEW FEATURES STATE
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // --- LOGIC ---
  const createIdentity = () => {
    const newIdentity = new Identity();
    setIdentity(newIdentity);
    setStatus("Identity Generated ✓");
  };

  const joinGroup = async () => {
    if (!identity) return;
    setStatus("Joining Group...");
    try {
      if (!window.ethereum) throw new Error("No Wallet Found!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.joinGroup(identity.commitment);
      await tx.wait();
      setHasJoined(true);
      setStatus("Joined successfully!");
    } catch (e: any) {
      console.error(e);
      setStatus("Error: " + (e.reason || e.message));
    }
  };

  const sendWhistle = async () => {
    if (!identity) return;
    if (!complaint && !file) return alert("Enter text or upload file");

    setLoading(true);
    setStatus("Processing...");

    try {
      let finalContent = complaint;

      // 1. Upload File (If exists)
      if (file) {
        setStatus("Uploading to IPFS...");
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (uploadRes.data.ipfsHash) {
          // --- FIX IS HERE ---
          // Combine Hash and Text using a generic separator "|||"
          // If complaint is empty, it just sends the hash.
          finalContent = `${uploadRes.data.ipfsHash}|||${complaint}`; 
        }
      }

      // 2. Generate Proof
      setStatus("Generating ZK Proof...");
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const groupId = await contract.groupId(); 
      
      const group = new Group([identity.commitment]);
      const proof = await generateProof(identity, group, 1, groupId.toString());

      // 3. Send to Relay
      setStatus("Relaying to Blockchain...");
      const res = await axios.post("/api/relay", {
        merkleTreeRoot: proof.merkleTreeRoot,
        nullifier: proof.nullifier,
        points: proof.points,
        signal: 1,
        merkleTreeDepth: group.depth,
        ipfsCid: finalContent
      });

      setStatus(`Whistle Blown! Tx: ${res.data.txHash}`);
      setComplaint("");
      setFile(null);
      fetchLogs();

    } catch (e: any) {
      console.error(e);
      setStatus("Error: " + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const events = await contract.queryFilter("NewComplaint");
      
      const formattedLogs = events.map((event: any) => ({
        id: event.transactionHash,
        message: event.args[1],
        block: event.blockNumber
      }));
      setLogs(formattedLogs.reverse());
    } catch (e) {
      console.log("Error fetching logs", e);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // --- ORIGINAL UI (RESTORED) ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        
        {/* LEFT COLUMN */}
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Zk-Whistle 🤫</h1>
            <p className="text-gray-400">Anonymous Campus Reporting (Zero-Knowledge)</p>
          </div>

          {/* Status Box */}
          <div className="p-4 border border-gray-700 rounded bg-slate-900 text-yellow-300 break-all">
            Status: {status}
          </div>

          {/* Step 1 Box */}
          <div className="p-6 border border-gray-700 rounded bg-slate-900">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Step 1: Identity</h2>
            {!identity ? (
              <button onClick={createIdentity} className="text-blue-400 hover:underline">
                Generate Identity -&gt;
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-green-400">Identity Generated ✓</p>
                {!hasJoined && (
                  <button onClick={joinGroup} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">
                    Join Group
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Step 2 Box (With File Input) */}
          <div className="p-6 border border-gray-700 rounded bg-slate-900">
            <h2 className="text-xl font-bold mb-4 text-red-400">Step 2: Whistleblow</h2>
            
            <textarea
              className="w-full bg-slate-800 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-red-500 mb-4"
              rows={4}
              placeholder={file ? "Image selected. Add a caption (optional)..." : "Describe the issue..."}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              disabled={loading}
            />

            {/* Simple File Input */}
            <div className="mb-4">
              <input 
                type="file" 
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                disabled={loading}
              />
            </div>

            <button
              onClick={sendWhistle}
              disabled={!hasJoined || loading}
              className={`w-full py-3 rounded font-bold transition-colors ${
                !hasJoined || loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Processing..." : "Post Anonymously"}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (Feed) */}
        <div className="w-full max-w-md mt-10 lg:mt-0">
          <h2 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-green-500 pl-3">Live Feed</h2>
          
          <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
            {logs.map((log) => {
              // SPLIT LOGIC: Separate Hash and Text
              const parts = log.message.split("|||");
              const isImage = parts[0].startsWith("Qm") || parts[0].startsWith("baf");
              
              const displayHash = isImage ? parts[0] : null;
              const displayText = isImage ? parts[1] : parts[0];

              return (
                <div key={log.id} className="p-4 border border-gray-800 rounded bg-slate-900 hover:border-green-900/30 transition group">
                  
                  {/* --- NEW: VERIFICATION BADGE --- */}
                  <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                    <span className="text-green-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      ZK-Verified Proof
                    </span>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${log.id}`} 
                      target="_blank"
                      className="text-xs text-gray-600 hover:text-blue-400 transition"
                    >
                      View On-Chain ↗
                    </a>
                  </div>
                  {/* ------------------------------- */}

                  {/* SHOW IMAGE (If exists) */}
                  {displayHash && (
                    <div className="mb-3">
                      <img 
                        src={`https://gateway.pinata.cloud/ipfs/${displayHash}`} 
                        alt="Evidence" 
                        className="rounded border border-gray-700 max-h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* SHOW TEXT (If exists) */}
                  {displayText && (
                    <p className="text-gray-200 mb-2 font-medium leading-relaxed">
                      {displayText}
                    </p>
                  )}

                  {/* Footer Info */}
                  <div className="text-[10px] text-gray-500 font-mono mt-2 pt-2 flex justify-between">
                    <span>Block: #{log.block}</span>
                    <span className="truncate w-24 opacity-50 group-hover:opacity-100 transition">
                      Nullifier: {log.id.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              );
            })}
            
            {logs.length === 0 && <p className="text-gray-600">No whistles yet.</p>}
          </div>
        </div>

      </div>
    </main>
  );
}