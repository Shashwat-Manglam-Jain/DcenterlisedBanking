const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", function () {
    let Bank;
    let bank;
    let giver;
    let receiver;
    let otherAccount;
    const requestAmount = ethers.parseEther("1"); // 1 ETH

    // Deploy the contract and setup signers before each test
    beforeEach(async function () {
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        [giver, receiver, otherAccount] = await ethers.getSigners();
    });

    describe("Request Amount", function () {
        it("should allow a user to request an amount from another user", async function () {
            // Receiver requests amount from giver
            await bank.connect(receiver).requestAmount(
                giver.address,
                requestAmount,
                "ReceiverName",
                "Request for money"
            );

            // Check request count for giver
            expect(await bank.reqCount(giver.address)).to.equal(1);

            // Check request history for receiver
            const requestHistory = await bank.getReqHistory(receiver.address);
            expect(requestHistory.length).to.equal(1);
            expect(requestHistory[0].name).to.equal("ReceiverName");
            expect(requestHistory[0].amount).to.equal(requestAmount);
            expect(requestHistory[0].message).to.equal("Request for money");
        });
    });

    describe("Send Amount", function () {
        beforeEach(async function () {
            // Setup a request for funds before sending the amount
            await bank.connect(receiver).requestAmount(
                giver.address,
                requestAmount,
                "ReceiverName",
                "Request for money"
            );
        });

        it("should allow a user to send the requested amount", async function () {
            // Giver sends the exact requested amount
            await bank.connect(giver).sendAmount(
                receiver.address,
                requestAmount,
                "ReceiverName",
                "Request for money",
                { value: requestAmount }
            );

            // Check request count for giver (should decrement after payment)
            expect(await bank.reqCount(giver.address)).to.equal(0);

            // Check transaction history for giver
            const allTransactions = await bank.getAllTransactionsHistory();
            expect(allTransactions.length).to.equal(1);
            expect(allTransactions[0].amountofwhowantmoney).to.equal(requestAmount);
            expect(allTransactions[0].namewhowantmoney).to.equal("ReceiverName");

            // Check that request history of receiver is updated to "Paid"
            const requestHistory = await bank.getReqHistory(receiver.address);
            expect(requestHistory[0].paymentType).to.equal("Paid");
        });

    
    });

    describe("Get Amount to Pay", function () {
        beforeEach(async function () {
            // Receiver requests an amount from giver
            await bank.connect(receiver).requestAmount(
                giver.address,
                requestAmount,
                "ReceiverName",
                "Request for money"
            );
        });

        it("should return the payment requests for a sender", async function () {
            const amountToPay = await bank.getAmountToPay(giver.address);
            expect(amountToPay.length).to.equal(1);
            expect(amountToPay[0].namewhowantmoney).to.equal("ReceiverName");
            expect(amountToPay[0].amountofwhowantmoney).to.equal(requestAmount);
        });
    });

   
    });

  


