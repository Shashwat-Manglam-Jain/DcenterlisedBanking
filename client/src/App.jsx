import React, { useContext  } from "react";

import Middle from "./Components/Middle";
import { Navbar } from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import { MyContext } from "./UseContext"; // Importing MyContext from UseContext
import RequestHistory from "./Components/RequestHistory";
import Nonlogin from "./Components/Nonlogin";

function App() {

  const { 
    balance, 
    setBalance, 
    contract, 
    setContract, 
    account, 
    setAccount 
  } = useContext(MyContext); // Correct usage of useContext


  return (
    <>
      <Navbar />
      <br /><br /><br />
      <Routes>
        {/* <Route path="/activities" element={<AllDetails />} /> */}
        <Route path="/request-sentmoney-history" element={<RequestHistory/>} />
        <Route
          path="/"
          element={
            contract == null ? (
          <Nonlogin/>
            ) : (
              <Middle/>
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
