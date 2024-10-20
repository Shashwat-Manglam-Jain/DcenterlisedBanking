import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../UseContext";

export const Navbar = () => {
  const { 

    contract, 
    setContract, 
  
  } = useContext(MyContext); 
  const handleWalletAction = () => {
    if (contract) {
      // If already connected, disconnect wallet and reload the page
      setContract(null);
    } else {
      // If not connected, trigger the connection logic (handled by App useEffect)
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          window.location.reload();  // Refresh to trigger connection in App
        })
        .catch((error) => {
          console.error("Connection error:", error);
        });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light position-fixed shadow" style={{ width: '100%', zIndex: 10 }}>
      <div className="container">
        <a className="navbar-brand fw-bold fs-2 text-decoration-none text-primary" href="#">
          Pay
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li className="nav-item">

             <Link to="/" className="nav-link active" >
                Summary
              </Link>
            </li>
            <li className="nav-item"> <Link to="./" className="nav-link">Activity</Link>
         
            </li>
            <li className="nav-item">
              <Link to="/request-sentmoney-history" className="nav-link">
                Send & Request
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Wallet
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Help
              </a>
            </li>
          </ul>
          <form className="d-flex">
            <button className="btn btn-outline-primary" type="button" onClick={handleWalletAction}>
              {contract ? "Disconnect Wallet" : "Connect Wallet"}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};
