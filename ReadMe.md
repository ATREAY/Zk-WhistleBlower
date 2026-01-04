# 🤫 ZK-Whistle: Anonymous Campus Reporting

**ZK-Whistle** is a decentralized application (DApp) that enables users to report issues (whistleblow) anonymously on the blockchain.

It uses **Zero-Knowledge Proofs (Semaphore Protocol)** to allow users to prove they are valid members of a group (e.g., students on a campus) without revealing *which* specific member they are.

## 🚀 Features

* **True Anonymity:** Uses Semaphore ZK-proofs to decouple identity from action.
* **Decentralized Storage:** Evidence (images/text) is stored on IPFS via Pinata.
* **Gasless Reporting:** A backend "Relayer" pays the gas fees, so the user's wallet address is never associated with the whistleblowing transaction.
* **Live Feed:** Real-time on-chain feed of verified anonymous reports.

## 🛠️ Tech Stack

* **Blockchain:** Ethereum (Sepolia Testnet), Solidity, Hardhat
* **Privacy:** Semaphore Protocol (Zero-Knowledge Circuits)
* **Frontend:** Next.js, React, Tailwind CSS, Ethers.js
* **Storage:** IPFS (Pinata)
* **Backend:** Next.js API Routes (acting as the Relayer)

## 📦 Prerequisites

* **Node.js** (v18 or higher)
* **A Wallet** (Rabby or MetaMask) installed in your browser.
* **Sepolia Testnet ETH:**
    * ⚠️ **Required:** You need at least **0.05 Sepolia ETH** to pay for the initial "Join Group" gas fees (the relayer handles the rest).
    * 🚰 **Option 1: Free Faucets (Fastest):**
        * [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
        * [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) (Requires login)
    * ⛏️ **Option 2: Worst Case (Mining):**
        * If standard faucets are empty or erroring, use the [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/).
        * **How:** Enter your address and leave the tab open to "mine" ETH in your browser.
        * **Time Required:** ~1-2 hours to mine 0.05 ETH (depends on your CPU speed).
* **Alchemy Account** (for RPC URL).
* **Pinata Account** (for IPFS uploads).

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/ZK-Whistle.git](https://github.com/YOUR_USERNAME/ZK-Whistle.git)
cd ZK-Whistle

```

### 2. Install Dependencies

Install packages for both the Hardhat backend and the Next.js frontend.

```bash
npm install
# OR if you have a separate backend folder
cd backend && npm install
cd ../frontend && npm install

```

### 3. Configure Environment Variables

- Create a `.env` file in your backend directory with the following keys:

* Alchemy RPC URL (Sepolia)
```bash
ALCHEMY_URL="[https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY](https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY)"
```

* Private Key for the Relayer/Deployer Wallet
* (Must have Sepolia ETH to pay for gas)
```bash
METAMASK_PRIVATE_KEY="0x..."
```
- Create a `.env.local` file in your frontend directory with the following keys:

* The Contract Address you just deployed in the backend
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS="YOUR_CONTRACT_GENERATED_ADDRESS"

```

* Private Key of the Relayer/Deployer Wallet
* (Must have Sepolia ETH to pay for gas)
```bash
METAMASK_RELAYER_PRIVATE_KEY="0x..."
```
* Pinata Keys for Image Uploads
```bash
PINATA_JWT="YOUR_PINATA_JWT"
```

## ⛓️ Smart Contract Deployment

1. Compile the contracts:
```bash
npx hardhat compile

```


2. Deploy to Sepolia Testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia

```


3. **Important:** Copy the address printed in the terminal (e.g., `0x123...`) and update the `CONTRACT_ADDRESS` constant in your `frontend/app/page.tsx` file.

## 🏃‍♂️ Running the App

Start the Next.js development server:

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

## 📖 How to Use

1. **Generate Identity:** Click the button to create a secret ZK identity locally in your browser.
2. **Join Group:** Click "Join" to register your identity on the blockchain. This requires a one-time wallet signature.
3. **Whistleblow:**
* Upload an image (optional) and write a description.
* Click **Post Anonymously**.
* The app generates a ZK-Proof proving you are in the group.
* The Relayer submits the transaction.


4. **Verify:** Watch your report appear in the Live Feed with a "ZK-Verified" badge.

## 🛡️ Troubleshooting

* **"Insufficient Funds":** Ensure your Relayer wallet (in `.env`) has Sepolia ETH.
* **"Range too large":** If the live feed fails, Alchemy Free Tier limits log scanning. The code is set to scan only the last 5-10 blocks. Blow a new whistle to see it appear.
* **Wallet Issues:** Ensure your wallet (MetaMask/Rabby) is connected to the **Sepolia Network**.

---
