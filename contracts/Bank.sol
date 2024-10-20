// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Bank {
   mapping(address => string) public username;
    mapping(address => string) public imgurl;
 

    struct Transaction {
        string name;
        string message;
        uint256 amount;
        string paymentType;
        address whowillsendmoney;
        uint256 timestamp;
    }

    struct AmountPay {
        string namewhowantmoney;
        string messageofwhowantmoney;
        uint256 amountofwhowantmoney;
        string paymentType;
        address whowantmoney;
        uint256 timestamp;
    }
   mapping (address => uint) public reqCount;
    mapping(address => Transaction[]) private reqHistory;
    mapping(address => AmountPay[]) private payAmount;
    mapping(address => AmountPay[]) private allTransactions;

  function requestAmount(
    address whowillgivemoney, 
    uint256 _amount,
    string memory _name,
    string memory _message
) external {
    // Add a transaction to the requester's history
    reqHistory[msg.sender].push(Transaction({
        name: _name,
        message: _message,
        amount: _amount,
        paymentType: "Pending",
        whowillsendmoney: whowillgivemoney,
        timestamp: block.timestamp
    }));

    // Increment request count for the giver
    reqCount[msg.sender] += 1;

    // Add a payment record to the person who will send the money
    payAmount[whowillgivemoney].push(AmountPay({
        namewhowantmoney: _name,
        messageofwhowantmoney: _message,
        amountofwhowantmoney: _amount,
        paymentType: "Pending",
        whowantmoney: msg.sender,
        timestamp: block.timestamp
    }));
}


    // Function to retrieve the request history of a specific account
    function getReqHistory(address requester) 
        external 
        view 
        returns (Transaction[] memory) 
    {
        return reqHistory[requester];
    }

    // Function to get the request count of the caller
    function getReqCount() 
        external 
        view 
        returns (uint256) 
    {
        return reqCount[msg.sender];
    }

    // Function to retrieve the transaction history of the caller
    function getAllTransactionsHistory() 
        external 
        view 
        returns (AmountPay[] memory) 
    {
        return allTransactions[msg.sender];
    }

    // Function to get the amount to pay for a specific sender
    function getAmountToPay(address sender) 
        external 
        view 
        returns (AmountPay[] memory) 
    {
        return payAmount[sender];
    }

    // Function to transfer a specified amount
    function sendAmountToPay(address whowantmoney, uint256 amounts,  string memory name, 
    string memory message) 
        external 
        payable
    {
        payable(whowantmoney).transfer(amounts);
           allTransactions[msg.sender].push(AmountPay({
        namewhowantmoney: name,
        messageofwhowantmoney: message,
        amountofwhowantmoney: amounts,
        paymentType: "Sender",
        whowantmoney: whowantmoney,
        timestamp: block.timestamp}));
    }

    function setDetails(string memory url, string memory name) external {
     
        imgurl[msg.sender] = url;
       
        username[msg.sender] = bytes(name).length > 0 ? name : "Anonymous";
    }

    
    function getimgDetails() external view returns (string memory) {
        
        return imgurl[msg.sender];
    }

     function getuserNameDetails() external view returns (string memory) {
        
        return username[msg.sender];
    }
  
function sendAmount(
    address whowantmoney, 
    uint256 amounts, 
    string memory name, 
    string memory message
) external payable {
    AmountPay[] storage payHis = payAmount[msg.sender];
    Transaction[] storage history = reqHistory[whowantmoney];



    uint256 indexReq = 0;
    uint256 indPay = 0;
  

    for (uint256 j = 0; j < payHis.length; j++) {
        if (
            payHis[j].amountofwhowantmoney == amounts && 
            keccak256(bytes(payHis[j].messageofwhowantmoney)) == keccak256(bytes(message)) && 
            keccak256(bytes(payHis[j].namewhowantmoney)) == keccak256(bytes(name))
        ) {
            indPay = j;
    
            break;
        }
    }

    for (uint256 i = 0; i < history.length; i++) {
        if (
            history[i].amount == amounts && 
            keccak256(bytes(history[i].message)) == keccak256(bytes(message)) && 
            keccak256(bytes(history[i].name)) == keccak256(bytes(name))
        ) {
            indexReq = i;
        
            break;
        }
    }

 

    // Transfer amount
    payable(whowantmoney).transfer(amounts);

    reqCount[msg.sender] -= 1;

    // Record the transaction
    allTransactions[msg.sender].push(AmountPay({
        namewhowantmoney: name,
        messageofwhowantmoney: message,
        amountofwhowantmoney: amounts,
        paymentType: "Sender",
        whowantmoney: whowantmoney,
        timestamp: block.timestamp
    }));

    reqHistory[whowantmoney][indexReq].paymentType = "Paid";

    // Safely remove the completed payment request from payAmount array
    payAmount[msg.sender][indPay] = payAmount[msg.sender][payHis.length - 1];
    payAmount[msg.sender].pop();
}

   
}
