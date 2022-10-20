const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const linkAbi = require("./ContractJson/Link.json");

describe("RandomNumber", async ()=> {
    let RandomNumber, randomNumber, VrfCoordinator, vrfCoordinator, link, deployer, per1, perLink;

    before(async ()=> {
        await hre.network.provider.request({ 
            method: "hardhat_impersonateAccount",
            params: ["0xd8f772840d9bf2141ec64c1b17127d14663c3226"],
        });

        link = await new ethers.Contract( "0x404460C6A5EdE2D891e8297795264fDe62ADBB75" , linkAbi);

        VrfCoordinator = await ethers.getContractFactory("VRFCoordinator");
        vrfCoordinator = await VrfCoordinator.deploy(link.address);

        RandomNumber = await ethers.getContractFactory("RandomNumber");
        randomNumber = await RandomNumber.deploy(
            vrfCoordinator.address,
            "0x404460C6A5EdE2D891e8297795264fDe62ADBB75"
        );

        perLink = await ethers.getSigner("0xd8f772840d9bf2141ec64c1b17127d14663c3226");
        [deployer, per1] = await ethers.getSigners();

        await network.provider.send("hardhat_setBalance", [
            perLink.address,
            ethers.utils.formatBytes32String("5000000000000000000"),
        ]);
    });

    describe("Link balance in the contract", async ()=> {

        it("Shouldn't have balance", async ()=> {
            expect(await link.connect(deployer).balanceOf(randomNumber.address)).to.equal(0);
        });

        it("No link does not work", async ()=> {
            await expect(randomNumber.connect(deployer).getRandomNumber(
            )).to.be.revertedWith("Not enough LINK - fill contract with faucet");
        });

        it("Should have balance", async ()=> {
            await link.connect(perLink).transfer(
                randomNumber.address, 
                ethers.utils.parseEther("1000")
            );

            expect(await link.connect(deployer).balanceOf(
                randomNumber.address
            )).to.equal(ethers.utils.parseEther("1000"));
        });
    });

    describe("Security", async ()=> {
        it("Only the owner can execute the functions", async ()=> {
            await expect(randomNumber.connect(per1).getRandomNumber(
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(randomNumber.connect(per1).setUntil(
                5
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(randomNumber.connect(per1).withdrawFunds(
                true,
                link.address
            )).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Get value", async ()=> {
        it("Start value must be 0", async ()=> {
            expect(await randomNumber.connect(deployer).until()).to.equal(1);
            expect(await randomNumber.connect(deployer).randomResult()).to.equal(0);
        });

        it("The 'Until' value must be modified", async ()=> {
            await randomNumber.connect(deployer).setUntil(20);
            expect(await randomNumber.connect(deployer).until()).to.equal(20);
        });

        it("Should return a random number in the given range", async ()=> {
            await randomNumber.connect(deployer).getRandomNumber();
            let requestId = await randomNumber.connect(deployer).lastRequestId();

            await vrfCoordinator.connect(deployer).callBackWithRandomness(
                requestId,
                "777",
                randomNumber.address
            );
            let value = await randomNumber.connect(deployer).randomResult();

            assert(value > 0);
            assert(value <= 20);
        });
    });

    describe("Withdraw funds", async ()=> {
        before(async ()=> {
            expect(await ethers.provider.getBalance(randomNumber.address)).to.equal(0);

            await network.provider.send("hardhat_setBalance", [
                randomNumber.address,
                ethers.utils.formatBytes32String("5000000000000000000"),
            ]);

            expect(await ethers.provider.getBalance(randomNumber.address)).to.be.above(0);
        });

        it("Error: Token address should be valid", async ()=> {
            await expect(randomNumber.connect(deployer).withdrawFunds(
                true,
                "0x0000000000000000000000000000000000000000"
            )).to.be.revertedWith("Error: Invalid token address");
        });

        it("Withdraw tokens and BNB", async ()=> {
            await randomNumber.connect(deployer).withdrawFunds(
                true,
                link.address
            )

            expect(await ethers.provider.getBalance(randomNumber.address)).to.equal(0);
            expect(await link.connect(deployer).balanceOf(
                randomNumber.address
            )).to.equal(0);
        });
    });
});