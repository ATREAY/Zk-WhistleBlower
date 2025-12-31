import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("file", file);
    
    // Create metadata (Optional)
    const metadata = JSON.stringify({ name: "ZkWhistle Evidence" });
    formData.append("pinataMetadata", metadata);

    // Create options (Optional)
    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    // Send to Pinata
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    const resData = await res.json();
    
    if (!res.ok) {
      throw new Error("Pinata Upload Failed");
    }

    // Return the IPFS Hash (CID)
    return NextResponse.json({ ipfsHash: resData.IpfsHash }, { status: 200 });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}