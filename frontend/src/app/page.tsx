"use client";
import { useState } from "react";
import { ethers } from "ethers";
import WalletConnector from "@/component/WalletConnector";

// Import the contract ABI
import DeliveryEscrow from "@/contracts/DeliveryEscrow.json";

const CONTRACT_ADDRESS = "0x07730C21A875320891E2CFA9697cc05346EeF6C0";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string>("");
  const [contractor, setContractor] = useState<string>("");
  const [itemDetails, setItemDetails] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [escrowDetails, setEscrowDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return alert("Please connect your wallet first.");

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return alert("Please enter a valid amount in ETH.");
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DeliveryEscrow.abi, signer);

      const tx = await contract.createEscrow(
        jobId,
        contractor,
        itemDetails,
        { value: ethers.parseEther(amount) }
      );

      await tx.wait();
      alert("Escrow created successfully!");

      setJobId("");
      setContractor("");
      setItemDetails("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Error while submitting escrow.");
    }
  };

  const fetchEscrowDetails = async () => {
    if (!walletAddress) return alert("Please connect your wallet first.");

    if (!jobId.trim()) {
      return alert("Please enter a valid Job ID.");
    }

    setIsLoading(true);
    setError("");

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DeliveryEscrow.abi, provider);

      // Call the smart contract function
      const details = await contract.getDeliveryDetails(jobId);
      console.log("Raw escrow details:", details); // Debug log

      // Check if the escrow exists
      if (!details || details[0] === ethers.ZeroAddress) {
        alert("No escrow found for this Job ID.");
        setEscrowDetails(null);
        return;
      }

      // Format the details properly
      const formattedDetails = {
        client: details[0],
        contractor: details[1],
        itemDetails: details[2],
        amount: ethers.formatEther(details[3]),
        isCompleted: details[4],
        fundsReleased: details[5]
      };

      console.log("Formatted escrow details:", formattedDetails); // Debug log
      setEscrowDetails(formattedDetails);
    } catch (error) {
      console.error("Failed to fetch escrow:", error);
      setError("Failed to fetch escrow details");
      setEscrowDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

 const releaseEscrow = async () => {
  if (!walletAddress) return alert("Please connect your wallet first.");

  if (!jobId.trim()) {
    return alert("Please enter a valid Job ID.");
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DeliveryEscrow.abi, signer);

    // Check delivery status first
    const escrow = await contract.getDeliveryDetails(jobId);
    const isDelivered = escrow[4]; // Assuming delivery status is the 5th return value

    if (!isDelivered) {
      return alert("Delivery is not confirmed yet. Please confirm delivery first.");
    }

    // Call the correct function "releasePayment"
    const tx = await contract.releasePayment(jobId);

    await tx.wait();
    alert("Escrow released successfully!");
    fetchEscrowDetails();
  } catch (error) {
    console.error("Error releasing escrow:", error);
    alert("Failed to release escrow.");
  }
};

const confirmDelivery = async () => {
  if (!walletAddress) return alert("Please connect your wallet first.");

  if (!jobId.trim()) {
    return alert("Please enter a valid Job ID.");
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DeliveryEscrow.abi, signer);

    // Call the confirmDelivery function
    const tx = await contract.confirmDelivery(jobId);
    await tx.wait();

    alert("Delivery confirmed successfully!");
    fetchEscrowDetails();
  } catch (error) {
    console.error("Error confirming delivery:", error);
    alert("Failed to confirm delivery.");
  }
};

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-blue-400 mb-4">
          🚀 DeliveryEscrow Platform
        </h1>
        <p className="text-lg text-gray-400">
          Secure your transactions with blockchain technology.
        </p>
      </header>

      {/* Wallet Connector */}
      <section className="flex flex-col items-center">
        <WalletConnector onConnect={handleWalletConnect} />

        {walletAddress && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Connected Wallet:
            </h2>
            <p className="text-lg break-all">{walletAddress}</p>
          </div>
        )}

        {/* Escrow Form */}
        <form onSubmit={handleSubmit} className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Create Escrow</h2>

          <label className="block mb-4">
            <span className="text-gray-300">Job ID:</span>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Contractor Address:</span>
            <input
              type="text"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Item Details:</span>
            <textarea
              value={itemDetails}
              onChange={(e) => setItemDetails(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Amount (ETH):</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold">Create Escrow</button>

          <button 
            type="button" 
            onClick={confirmDelivery}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Confirm Delivery
          </button>

          <button type="button" onClick={releaseEscrow} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold">Release Escrow</button>

          <button type="button" onClick={fetchEscrowDetails} className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold" disabled={isLoading}>
            {isLoading ? 'Fetching...' : 'Fetch Escrow Details'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500 text-white rounded-lg">
              {error}
            </div>
          )}
        </form>

        {escrowDetails && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">Escrow Details</h2>
            <div className="space-y-2">
              <p><span className="text-gray-400">Client:</span> {escrowDetails.client}</p>
              <p><span className="text-gray-400">Contractor:</span> {escrowDetails.contractor}</p>
              <p><span className="text-gray-400">Item Details:</span> {escrowDetails.itemDetails}</p>
              <p><span className="text-gray-400">Amount:</span> {escrowDetails.amount} ETH</p>
              <p><span className="text-gray-400">Delivery Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded ${
                  escrowDetails.isCompleted ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {escrowDetails.isCompleted ? 'Completed' : 'Pending'}
                </span>
              </p>
              <p><span className="text-gray-400">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded ${
                  escrowDetails.fundsReleased ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {escrowDetails.fundsReleased ? 'Released' : 'Locked'}
                </span>
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

