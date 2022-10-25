const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const linkAbi = require("./ContractJson/Link.json");

///@dev To run the test change the state of the functions from "Internal" to "Public"
xdescribe("RandomNumberInteract", async ()=> {
    let RandomNumber, randomNumber, RandomNumberInteract, randomNumberInteract, 
    VrfCoordinator, vrfCoordinator, link, owner, user, userWithLink;

    before(async ()=> {
        await hre.network.provider.request({ 
            method: "hardhat_impersonateAccount",
            params: ["0xd8f772840d9bf2141ec64c1b17127d14663c3226"],
        });

        userWithLink = await ethers.getSigner("0xd8f772840d9bf2141ec64c1b17127d14663c3226");
        [owner, user] = await ethers.getSigners();

        await network.provider.send("hardhat_setBalance", [
            userWithLink.address,
            ethers.utils.formatBytes32String("5000000000000000000"),
        ]);

        link = await new ethers.Contract( "0x404460C6A5EdE2D891e8297795264fDe62ADBB75" , linkAbi);

        RandomNumberInteract = await ethers.getContractFactory("RandomNumberInteract");
        randomNumberInteract = await RandomNumberInteract.deploy();

        VrfCoordinator = await ethers.getContractFactory("VRFCoordinator");
        vrfCoordinator = await VrfCoordinator.deploy(link.address);

        RandomNumber = await ethers.getContractFactory("RandomNumber");
        randomNumber = await RandomNumber.deploy(
            vrfCoordinator.address,
            "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
            randomNumberInteract.address
        );

        await randomNumberInteract.connect(owner)._initialize_randomNumberInteract(
            randomNumber.address, 
            vrfCoordinator.address
        );

        await link.connect(userWithLink).transfer(
            randomNumber.address, 
            ethers.utils.parseEther("1000")
        );

        expect(await link.connect(owner).balanceOf(
            randomNumber.address
        )).to.equal(ethers.utils.parseEther("1000"));
    });

    it("Error: Only contract should be able to get random number", async()=> {
        await expect(randomNumber.connect(user).getRandomNumber()).to.be.revertedWith(
            "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x436f6e7472616374000000000000000000000000000000000000000000000000"
        );
    });

    it("Contract should be able to get random number", async ()=> {
        expect(await randomNumberInteract.connect(owner)._lastLotteryResult()).to.equal(0);

        await randomNumberInteract.connect(owner)._getRandomNumber();
        let lotteryResult = await randomNumberInteract.connect(owner)._lastLotteryResult();

        assert(lotteryResult > 0);
        assert(lotteryResult <= 999999);
    });
});