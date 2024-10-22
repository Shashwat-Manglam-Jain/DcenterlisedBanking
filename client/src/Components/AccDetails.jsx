import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { MyContext } from "../UseContext";
import axios from 'axios';

const AccDetails = () => {
  const img = [
    "https://static.vecteezy.com/system/resources/thumbnails/022/385/025/small_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgx0V0eQnuQ7M8pkd9LUDtcSTlmVgg-6B_mOBqfu4TXAlDZuQwcf6ETHxAqPXhJzSbN9g&usqp=CAU",
    "https://img.freepik.com/premium-photo/cute-sweet-girl-anime-style_973189-39223.jpg",
    "https://img.freepik.com/premium-photo/cute-sweet-girl-anime-style_973189-39530.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlzRv5O6oKJQGtm9ixUzB-A8WZnydhQOJ4dkuDLYw6-PjOUcZan_xXbJxiRDSZ5snhwvc&usqp=CAU",
    "https://imgix.ranker.com/user_node_img/4373/87455191/original/satoru-gojo-u-2029987413?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=355",
    "https://i.pinimg.com/736x/00/e0/88/00e088924626aa2fa51ae4d7bb999622.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ11UR8iq5slNRJqkOWBTyzyzJcCEWd8PSibPH_V3eZRUAF_qRkiHR57C8OjOaIz0u8ZA&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTA1uc6Zc9YVyU3NDOGglUOMForTDsV5ZAwglyG4pUDt_-HTLElB1LtG5N8XtogofeXuY&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGcC7_NoK4QCdnnRsYgBJ4zsFY4Xv74L7dhwvZkUnzVfrPcJWtL_Iu43qbek5ZvPqS6M&usqp=CAU",
    "https://i.pinimg.com/564x/15/e8/b9/15e8b99051c139a88eb619134edb49c4.jpg",
    "https://i.pinimg.com/564x/7a/3d/3f/7a3d3f506502ca2fb0e2f83ebc773980.jpg",
  ];

  const {
    balance,
    setBalance,
    contract,
    setContract,
    setTransactions,
    account,
    setAccount, 
    setsactions
  } = useContext(MyContext);

  const [first, setFirst] = useState(true);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Reinitialize contract and fetch details when the page reloads
  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (contract) {
        const detailsimg = await contract.getimgDetails();
        const nameuser= await contract.getuserNameDetails();
        setUsername(nameuser);
        setImageFile(detailsimg);
    
      }
    };
    fetchBlockDetails();
  }, [contract]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setFirst(false);
    setTimeout(() => {
      setFirst(true);
    }, 3000);
  };

  const switchAccount = async (event) => {
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accountsList = await provider.send("eth_requestAccounts", []);
      setAccount(accountsList);
      if (accountsList.length > 0) {
        let newIndex = (currentAccountIndex + 1) % accountsList.length;
        setCurrentAccountIndex(newIndex);
        const newAccount = accountsList[newIndex];
        setAccount(newAccount);
        console.log("Account switched to:", newAccount);
        const balanceWei = await provider.getBalance(newAccount);
        const balanceInEther = ethers.formatEther(balanceWei);
        setBalance(balanceInEther);
        setsactions([]);
        setTransactions([]);
      } else {
        console.warn("No accounts found.");
      }
    } catch (error) {
      console.error("Error switching account:", error);
    }
  };




  const pinImageToIPFS = async (imageFile) => {
    const apiKey = '65e906089d94448f05e6';
    const apiSecret = '16960778c3074b92fdeeed48b7e55d4ebaf8700b0ea6f4da0f31595b0a7f83c4';

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', imageFile);

    const options = {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    };

    try {
      const response = await axios.post(url, formData, options);
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading image to Pinata:', error);
      return null;
    }
  };

  const setUser = async () => {
    if (!imageFile || !username) {
      console.error('Please provide both an image and a username.');
      return;
    }
    const imgUrl = await pinImageToIPFS(imageFile);
    if (imgUrl) {
      const details = await contract.setDetails(imgUrl, username);
      const modalElement = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      console.log('Details set successfully:', details);
    } else {
      console.error('Failed to upload image, user details not set.');
    }
  };

  const handleModalOpen = () => {
    const modalElement = document.getElementById('exampleModal');
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  return (
<>
  <div className="container-fluid p-3">
    <div className="card text-center shadow">
      <div className="card-header bg-secondary text-white">Account Details</div>
      <div className="card-body">
        <div className="row align-items-center mx-4">
          <div className="col-12 col-sm-3 text-center text-sm-start mb-3 mb-sm-0  ">
            <img
              src={imageFile || img[Math.floor(Math.random() * img.length)]}
              alt="User Avatar"
              className="img-fluid rounded-circle"
              style={{
                width: "75px",
                height: "75px",
                objectFit: "cover",
                
              }}
            />
          </div>
          <div className="col-12 col-sm-9 text-start">
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center mb-2">
              <h5 className="fw-normal fs-5 mb-0">Account:</h5>
              <p className="fs-5 fw-lighter text-muted ms-2 mb-0 text-truncate" style={{ maxWidth: "100%" }}>
                {account &&
                  `${account.substring(0, 5)}xxx...xxx${account.substring(account.length - 5)}`}
                <span>
                  {first ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                      onClick={copyToClipboard}
                      style={{ cursor: "pointer", marginLeft: "5px" }}
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check-circle"
                      style={{ marginLeft: "5px" }}
                    >
                      <path d="M9 11l3 3L22 4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </span>
              </p>
            </div>
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center mb-2">
              <h5 className="fw-normal fs-5 mb-0">Username:</h5>
              <p className="fs-5 fw-lighter text-muted ms-2 mb-0 text-truncate" style={{ maxWidth: "100%" }}>
                {username || "No username set"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-center align-items-center">
        <button
          className="btn btn-outline-secondary btn-sm me-3"
          onClick={switchAccount}
        >
          Switch Account
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleModalOpen}
        >
          Set Details
        </button>
      </div>
    </div>
  </div>

  <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Set Account Details
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">
              Profile Image
            </label>
            <input
              className="form-control"
              type="file"
              id="fileInput"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={setUser}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</>



  );
};

export default AccDetails;
