// utils/connectWallet.ts
import { ethers } from "ethers";

export async function connectWallet() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      console.log("Connected account:", await signer.getAddress());
      return { provider, signer };
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      return null;
    }
  } else {
    alert("MetaMask is not installed");
    return null;
  }
}
