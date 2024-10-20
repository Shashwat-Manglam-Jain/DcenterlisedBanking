import React, { createContext, useEffect, useState } from 'react';
import Bank from "./artifacts/contracts/Bank.sol/Bank.json";
import { ethers, Contract } from "ethers";

const MyContext = createContext();

const UseContext = ({ children }) => {
  const [balance, setBalance] = useState(null); 
  const [contract, setContract] = useState(null); 
  const [account, setAccount] = useState(null);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(true);
  const [loading, setLoading] = useState(true); 
  const [transactions, setTransactions] = useState([]);
  const [sactions, setsactions] = useState([]);

  useEffect(() => {
    const connectTo = async () => {
      setLoading(true); 
      console.log("Attempting to connect to blockchain...");

      try {
        if (typeof window.ethereum === 'undefined') {
          alert("Metamask is not installed. Please install Metamask to connect to the blockchain.");
          setIsMetamaskInstalled(false);
          setLoading(false);
          return;
        }

        // Instantiate the provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("Provider initialized:", provider);

        // Request account access
        await provider.send("eth_requestAccounts", []); 
        console.log("MetaMask account access granted.");

        // Get the signer and account address
        const signer = await provider.getSigner();
        const address = signer.address; // In ethers.js v6, address is a property, not a method
        console.log("Connected address:", address);
        setAccount(address);

        // Get balance in Ether
        const balanceWei = await provider.getBalance(address);
        const balanceInEther = ethers.formatEther(balanceWei);
        console.log("Balance (Ether):", balanceInEther);
        setBalance(balanceInEther);
        // 0xBC462dD61751dcbA2EB77bA3e16291d6F9950591
        // Connect to the contract
        const contractAddress = "0xA340A291b701821CAb4F2d5636E9fc1Be78Bd73D";
        const contractInstance = new Contract(contractAddress, Bank.abi, signer);
        console.log("Contract instance:", contractInstance);
        setContract(contractInstance);

      } catch (error) {
        console.error("Error in connecting to blockchain: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const handleAccountChange = async (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newAccount = accounts[0];
        setAccount(newAccount);

        const newBalanceWei = await provider.getBalance(newAccount);
        const newBalanceInEther = ethers.formatEther(newBalanceWei);
        setBalance(newBalanceInEther);

        // Reset the contract to use the new account's signer
        const contractInstance = new Contract(contractAddress, Bank.abi, provider.getSigner());
        setContract(contractInstance);
      }
    };

    connectTo();

    window.ethereum?.on("accountsChanged", handleAccountChange);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  if (!isMetamaskInstalled) {
    return <div>Please install Metamask to interact with this application.</div>;
  }

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status"></div>
       
      </div>
    );
  }

  return (
    <MyContext.Provider 
      value={{
        balance, 
        setBalance, 
        contract, 
        setContract, 
        account, 
        setAccount,
        transactions, 
        setTransactions,
        sactions, 
        setsactions
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default UseContext;
export { MyContext };
