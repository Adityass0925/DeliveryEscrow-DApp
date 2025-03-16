# 🚀 DeliveryEscrow Platform

A secure, blockchain-powered escrow platform built using **Next.js**, **TypeScript**, and **Ethereum** smart contracts. This project allows clients and contractors to create, manage, and release escrow transactions using the **DeliveryEscrow** smart contract on the **Sepolia Testnet**.

## 📌 Features

- **Wallet Integration**: Connect your MetaMask wallet seamlessly.
- **Create Escrow**: Secure transactions by locking funds until delivery is confirmed.
- **Release Escrow**: Release funds to the contractor after successful delivery.
- **Withdraw Funds**: Allow contractors to withdraw funds upon release.
- **Fetch Escrow Details**: Retrieve transaction details securely.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Blockchain**: Solidity Smart Contract (Ethereum Sepolia Testnet)
- **Tools**: Hardhat, Ethers.js

## 📂 Project Structure

```
├── contracts/         # Solidity Smart Contract
│   └── DeliveryEscrow.sol
├── frontend/         # Next.js Frontend
│   ├── components/   # Reusable React Components
│   ├── pages/        # Next.js Pages
│   └── public/       # Static Assets
└── hardhat.config.ts # Hardhat Configuration
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **MetaMask Wallet** (Browser Extension)
- **Hardhat** (for contract deployment)

### Clone the Repository

```bash
git clone https://github.com/Adityass0925/DeliveryEscrow-DApp.git
cd DeliveryEscrow-DApp
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file and add your **Sepolia Testnet** RPC and **Private Key**:

```
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
```

## 📜 Deploying the Smart Contract

1. Compile the contract:

```bash
npx hardhat compile
```

2. Deploy the contract to Sepolia Testnet:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Copy the deployed contract address to use in the frontend.

## 🌐 Running the Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Start the Next.js application:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📊 Usage Instructions

1. **Connect Wallet**: Ensure MetaMask is connected to Sepolia Testnet.
2. **Create Escrow**: Input job details and fund the escrow.
3. **Fetch Details**: Retrieve current escrow information.
4. **Release Escrow**: Release payment to the contractor.
5. **Withdraw Funds**: Contractors can withdraw released funds.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.

