import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { MyContext } from "../UseContext";

const Request = () => {
  const {
    contract,

    account,
  } = useContext(MyContext); // Correct usage of useContext
  const [reql, setReql] = useState(0);
  const [payreq, setPayreq] = useState([]); // Store filtered pay requests
  const [first, setFirst] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [count, setcount] = useState(0);
  // Function to send money request
  const sendRequest = async (askmoney, amount, name, message) => {
    if (!askmoney || !amount || !name || !message) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      amount = ethers.parseEther(amount.toString());
      console.log(askmoney, amount, name, message);

      await contract.requestAmount(askmoney, amount, name, message);

      // Reset input fields
      setWalletAddress("");
      setAmount(0);
      setName("");
      setMessage("");

      // Close the modal
      const modalElement = document.getElementById("requestModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      window.location.reload(true);
    } catch (error) {
      console.error("Error while sending request:", error);
    }
  };

  // Function to send money
  const sendMoney = async (whowantmoney, amounts, name, message) => {
    try {
      if (!whowantmoney || !amounts || !name || !message) {
        alert("Please fill in all fields before sending.");
        return;
      }

      console.log("Sending money with:", {
        walletAddress: whowantmoney,
        amounts: BigInt(amounts),
        name,
        message,
      });

      // Send the transaction using the estimated gas
      const tx = await contract.sendAmount(
        whowantmoney,
        BigInt(amounts),
        name,
        message,
        {
          value: BigInt(amounts),
        }
      );

      await tx.wait();
      // Hide modal
      const modalElement = document.getElementById("payModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      alert(`Successfully transferred ${amounts} Wei to ${whowantmoney}`);

      // Reload the page after successful transaction
      window.location.reload(true);
    } catch (error) {
      alert(error.message || "An error occurred while sending money.");
      console.error("Error while sending money:", error);
    }
  };

  const DirectlysendMoney = async (walletAddress, amount, name, message) => {
    if (!walletAddress || !amount || !name || !message) {
      alert("Please fill in all fields before sending.");
      return;
    }

    amount = ethers.parseEther(amount.toString());

    console.log("Sending money with:", {
      walletAddress,
      amount,
      name,
      message,
    });
    try {
      const tx = await contract.sendAmountToPay(
        walletAddress,
        amount,
        name,
        message,
        {
          value: amount,
        }
      );

      await tx.wait();
      const modalElement = document.getElementById("payModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      alert(`Successfully transferred ${amount} Wei to ${walletAddress}`);

      // Reset input fields
      setWalletAddress("");
      setAmount(0);
      setName("");
      setMessage("");
      window.location.reload(true);
    } catch (error) {
      alert(error.message || "An error occurred while sending money.");
      console.error("Error while sending money:", error);
    }
  };

  // Fetch the request and payment data from the contract
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const history = await contract.getReqCount();

        setReql(history.toString());

        const payamt = await contract.getAmountToPay(account);
        setPayreq(payamt);
      } catch (error) {
        if (error.code === "CALL_EXCEPTION") {
          console.error("Call Exception:");
        } else {
          console.error("Unexpected error:");
        }
      }
    };

    if (contract && account) {
      fetchRequest();
    }
  }, [contract, account]);

  const openModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  // Click handler to trigger modal opening
  const handleButtonClick = (type) => {
    if (type === "pay") {
      openModal("payModal"); // Open Pay Modal
    } else if (type === "request") {
      openModal("requestModal"); // Open Request Modal
    }
    setFirst(type); // You can still set state for tracking purposes if needed
  };

  return (
    <div>
      <div className="d-flex justify-content-center gap-4 m-4">
        {/* Pay Button */}
        <div
          className="div justify-content-center text-center bg-primary m-2 rounded shadow-sm position-relative"
          style={{ width: "106px", cursor: "pointer" }}
          onClick={() => handleButtonClick("pay")} // Set first to "pay" and trigger modal
        >
          <h1 className="text-light">$</h1>
          <h5 className="text-light">Pay</h5>
          {payreq.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {payreq.length}
            </span>
          )}
        </div>

        {/* Request Button */}
        <div
          className="div justify-content-center text-center bg-primary m-2 rounded shadow-sm position-relative"
          style={{ width: "106px", cursor: "pointer" }}
          onClick={() => handleButtonClick("request")} // Set first to "request" and trigger modal
        >
          <h1 className="text-light">⇋</h1>
          <h5 className="text-light">Request</h5>
          {reql > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {reql.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Modals */}
      <div
        className="modal fade"
        id="requestModal"
        tabIndex="-1"
        aria-labelledby="requestModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="requestModalLabel">
                Request Amount
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6 className="mb-2">
                From whom you are asking money (add their wallet address):
              </h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Wallet address of sender"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />

              <h6 className="mb-2">Enter Amount in Eth:</h6>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />

              <h6 className="mb-2">Enter Your Name:</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <h6 className="mb-2">Enter Message:</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  sendRequest(walletAddress, amount, name, message)
                }
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="payModal"
        tabIndex="-1"
        aria-labelledby="payModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="payModalLabel">
                Pay Amount
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6 className="mb-2">Add address of Sender (who wants money):</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Wallet address of sender"
                value={
                  payreq.length > 0
                    ? payreq[count]?.whowantmoney
                    : walletAddress
                }
                onChange={(e) => setWalletAddress(e.target.value)}
                readOnly={payreq.length > 0}
              />

              <h6 className="mb-2">Enter Amount in Eth:</h6>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter Amount"
                value={
                  payreq.length > 0
                    ? ethers.formatEther(
                        payreq[count]?.amountofwhowantmoney.toString()
                      )
                    : amount
                }
                onChange={(e) => setAmount(e.target.value)}
                readOnly={payreq.length > 0}
              />

              <h6 className="mb-2">Enter Name:</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Name"
                value={
                  payreq.length > 0 ? payreq[count]?.namewhowantmoney : name
                }
                onChange={(e) => setName(e.target.value)}
                readOnly={payreq.length > 0}
              />

              <h6 className="mb-2">Enter Message:</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Message"
                value={
                  payreq.length > 0
                    ? payreq[count]?.messageofwhowantmoney
                    : message
                }
                onChange={(e) => setMessage(e.target.value)}
                readOnly={payreq.length > 0}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (count > 0) {
                    setcount(count - 1);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (count < payreq.length - 1) {
                    setcount(count + 1);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (payreq.length > 0) {
                    const {
                      whowantmoney,
                      amountofwhowantmoney,
                      namewhowantmoney,
                      messageofwhowantmoney,
                    } = payreq[count];
                    sendMoney(
                      whowantmoney,
                      amountofwhowantmoney,
                      namewhowantmoney,
                      messageofwhowantmoney
                    );
                  } else {
                    DirectlysendMoney(walletAddress, amount, name, message);
                  }
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
