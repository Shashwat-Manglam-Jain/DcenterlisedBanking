import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../UseContext";

const CurrentBalance = () => {
  const { 
    balance, 
  
  } = useContext(MyContext); // Correct usage of useContext
  const [usdValue, setUsdValue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the current price of ETH in USD
  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      return data.ethereum.usd; // Return the USD price of ETH
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return null; // Return null if there's an error
    }
  };

  // Effect to fetch ETH price on component mount or when balance changes
  useEffect(() => {
    const getEthPrice = async () => {
      setLoading(true); // Set loading to true when fetching price
      const price = await fetchEthPrice();
      if (price && balance !== null) { // Check if balance is not null
        setUsdValue(parseFloat(balance) * price); // Calculate USD value
      } else {
        setUsdValue(null); // Reset USD value if balance is null
      }
      setLoading(false); // Stop loading after fetching price
    };

    getEthPrice();
  }, [balance]); // Run effect when balance changes

  return (
    <div>
      <br />
      <div className="card text-center shadow">
        <div className="card-header bg-primary text-white">Current Balance</div>
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-baseline mb-2">
            <h5 className="card-title fw-lighter display-3 mb-0">
              {balance !== null ? parseFloat(balance).toFixed(3) : "N/A"} Eth
            </h5>
          </div>
          <div className="d-flex justify-content-center align-items-baseline">
            <h3>
              {loading ? "$000.00" : `$${usdValue !== null ? usdValue.toFixed(3) : "N/A"}`} USD
            </h3>
          </div>
          <div className="d-flex justify-content-center gap-4 mt-2">
            <a
              href="#"
              className="btn btn-outline-primary fs-6 rounded-pill px-4"
              aria-label="Swap Tokens"
            >
              Swap Tokens
            </a>
            <a
              href="#"
              className="btn btn-outline-primary fs-6 rounded-pill px-4"
              aria-label="Bridge Tokens"
            >
              Bridge Tokens
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentBalance;
