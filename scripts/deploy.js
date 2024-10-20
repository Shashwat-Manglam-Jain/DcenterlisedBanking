const hre = require("hardhat");

async function main() {
    // Get the ContractFactory
    const Bank = await hre.ethers.getContractFactory("Bank");

    // Deploy the contract
    const bank = await Bank.deploy();

    await bank.deployed();

    console.log("Bank contract deployed to:", bank.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
