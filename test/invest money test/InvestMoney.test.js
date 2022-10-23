const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const busdAbi = require("./ContractJson/Busd.json");
const crBusdAbi = require("./ContractJson/CrBusd.json");

///@dev To run the test change the state of the functions from "Internal" to "Public"
xdescribe("InvestMoney", async ()=> {
    let InvestMoney, investMoney, busd, crBusd, owner, user1, userWithBusd;

    before(async ()=> {
        await hre.network.provider.request({ 
            method: "hardhat_impersonateAccount",
            params: ["0x8c7de13ecf6e92e249696defed7aa81e9c93931a"],
        });

        [owner, user1] = await ethers.getSigners();
        userWithBusd = await ethers.getSigner("0x8c7de13ecf6e92e249696defed7aa81e9c93931a");

        busd = await new ethers.Contract( "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" , busdAbi);
        crBusd = await new ethers.Contract( "0x2Bc4eb013DDee29D37920938B96d353171289B7C" , crBusdAbi);
        InvestMoney = await ethers.getContractFactory("InvestMoney");
        investMoney = await InvestMoney.deploy();

        await network.provider.send("hardhat_setBalance", [
            userWithBusd.address,
            ethers.utils.formatBytes32String("5000000000000000000"),
        ]);
    });

    it("The contract should receive Busd", async ()=> {
        await busd.connect(userWithBusd).transfer(investMoney.address, ethers.utils.parseEther("1000"));

        expect(await busd.connect(owner).balanceOf(investMoney.address)).to.equal(ethers.utils.parseEther("1000"));
    });

    it("The contract should be able to mint crToken", async ()=> {
        await investMoney.connect(owner)._initialize_InvestMoney(crBusd.address);
        await investMoney.connect(owner)._mintCrtoken(busd.address, ethers.utils.parseEther("500"));

        expect(await busd.connect(owner).balanceOf(investMoney.address)).to.equal(ethers.utils.parseEther("500"));
        expect(await crBusd.connect(owner).balanceOf(investMoney.address)).to.be.above(0);
    });

    it("The contract should withdraw winnings from the stake", async ()=> {
        await network.provider.send("evm_increaseTime", [173000]);
        await network.provider.send("evm_mine");

        let balanceToWithdraw = await investMoney.connect(owner)._getCrtokenBalance();
        await investMoney.connect(owner)._redeemCrtoken(balanceToWithdraw);

        expect(await crBusd.connect(owner).balanceOf(investMoney.address)).to.equal(0);
        expect(await busd.connect(owner).balanceOf(investMoney.address)).to.be.above(ethers.utils.parseEther("1000"));
    });
});