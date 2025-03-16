// WalletConnector.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletConnectorProps {
  onConnect: (address: string) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);
      onConnect(address); // Notify parent component
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      onConnect(walletAddress);
    }
  }, [walletAddress, onConnect]);

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
    >
      {walletAddress ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnector;
