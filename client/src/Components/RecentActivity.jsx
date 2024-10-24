import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MyContext } from '../UseContext';

const RecentActivity = () => {
  const { sactions, setsactions, contract } = useContext(MyContext);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [copiedStatus, setCopiedStatus] = useState([]); // Array to track which address was copied

  // Function to copy account address to clipboard
  const copyToClipboard = (address, index) => {
    navigator.clipboard.writeText(address);

    // Update the copied status for the clicked item
    const updatedStatus = [...copiedStatus];
   
    updatedStatus[index] = true;
    setCopiedStatus(updatedStatus);

    // Reset the icon after 3 seconds
    setTimeout(() => {
      updatedStatus[index] = false;
      setCopiedStatus([...updatedStatus]);
    }, 3000);
  };

  useEffect(() => {
    const fetchTransHistory = async () => {
      try {
        const fetchedHistory = await contract.getAllTransactionsHistory();
        const historyArray = Array.from(fetchedHistory);

        if (historyArray.length > 0) {
          const sortedHistory = historyArray.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
          setsactions(sortedHistory);

          // Initialize copiedStatus array with `false` for each transaction
          setCopiedStatus(Array(sortedHistory.length).fill(false));
        } else {
          setsactions([]);
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    if (contract) {
      fetchTransHistory();
    }

    return () => {
      setsactions([]);
    };
  }, [contract]);

  const totalPages = Math.ceil(sactions.length / itemsPerPage);
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = sactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <>
      {contract ? (
        <div style={{ width: '100%' }}>
          <div className="card text-center shadow">
            <div className="card-header bg-danger text-white">Transaction Activity</div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Users</th>
                    <th scope="col">Status</th>
                    <th scope="col">Address</th>
                    <th scope="col">Message</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((val, index) => {
                      const address = val.whowantmoney.toString();
                      const timestamp = new Date(Number(val.timestamp) * 1000).toLocaleString();

                      return (
                        <tr key={val.id}>
                          <td>{val.namewhowantmoney}</td>
                          <td style={{ color: val.paymentType === 'Sender' ? 'red' : 'green' }}>
                            {val.paymentType}
                          </td>
                          <td>
                            {address.slice(0, 4)}xxx...xxx{address.slice(-4)}{' '}
                            <span>
                              {copiedStatus[index] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-copy-check"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <path d="m12 15 2 2 4-4" />
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-copy"
                                  onClick={() => copyToClipboard(address, index)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                              )}
                            </span>
                          </td>
                          <td>{val.messageofwhowantmoney}</td>
                          <td style={{ color: val.paymentType === 'Sender' ? 'red' : 'green' }}>
                            {(val.paymentType === 'Sender' ? '-' : '+') + ' ' + ethers.formatEther(val.amountofwhowantmoney.toString()) + ' ETH'}
                          </td>
                          <td>{timestamp.slice(0, 10)}</td>
                          <td>{timestamp.slice(11)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7">No Transactions available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="container d-flex justify-content-center">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                      <a className="page-link" href="#" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RecentActivity;
