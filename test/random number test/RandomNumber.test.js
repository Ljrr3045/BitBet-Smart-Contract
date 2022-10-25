const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const linkAbi = require("./ContractJson/Link.json");

describe("RandomNumber", async ()=> {
    let RandomNumber, randomNumber, VrfCoordinator, vrfCoordinator, link, owner1, owner2, user1, userWithLink;

    before(async ()=> {
        await hre.network.provider.request({ 
            method: "hardhat_impersonateAccount",
            params: ["0xd8f772840d9bf2141ec64c1b17127d14663c3226"],
        });

        userWithLink = await ethers.getSigner("0xd8f772840d9bf2141ec64c1b17127d14663c3226");
        [owner1, owner2, user1] = await ethers.getSigners();

        await network.provider.send("hardhat_setBalance", [
            userWithLink.address,
            ethers.utils.formatBytes32String("5000000000000000000"),
        ]);

        link = await new ethers.Contract( "0x404460C6A5EdE2D891e8297795264fDe62ADBB75" , linkAbi);

        VrfCoordinator = await ethers.getContractFactory("VRFCoordinator");
        vrfCoordinator = await VrfCoordinator.deploy(link.address);

        RandomNumber = await ethers.getContractFactory("RandomNumber");
        randomNumber = await RandomNumber.deploy(
            vrfCoordinator.address,
            "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
            owner2.address
        );
    });

    describe("Link balance in the contract", async ()=> {

        it("Shouldn't have balance", async ()=> {
            expect(await link.connect(owner1).balanceOf(randomNumber.address)).to.equal(0);
        });

        it("No link does not work", async ()=> {
            await expect(randomNumber.connect(owner2).getRandomNumber(
            )).to.be.revertedWith("Not enough LINK - fill contract with faucet");
        });

        it("Should have balance", async ()=> {
            await link.connect(userWithLink).transfer(
                randomNumber.address, 
                ethers.utils.parseEther("1000")
            );

            expect(await link.connect(owner1).balanceOf(
                randomNumber.address
            )).to.equal(ethers.utils.parseEther("1000"));
        });
    });

    describe("Security", async ()=> {
        it("Only user with appropriate roles can execute the functions", async ()=> {

            await expect(randomNumber.connect(owner1).getRandomNumber()).to.be.revertedWith(
                "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x436f6e7472616374000000000000000000000000000000000000000000000000"
            );

            await expect(randomNumber.connect(owner2).setUntil(5)).to.be.revertedWith(
                "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x41646d696e000000000000000000000000000000000000000000000000000000"
            );

            await expect(randomNumber.connect(owner2).withdrawFunds(true, link.address)).to.be.revertedWith(
                "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x41646d696e000000000000000000000000000000000000000000000000000000"
            );

            await expect(randomNumber.connect(user1).withdrawFunds(true, link.address)).to.be.revertedWith(
                "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x41646d696e000000000000000000000000000000000000000000000000000000"
            );
        });
    });

    describe("Get value", async ()=> {
        it("Start value must be 0", async ()=> {
            expect(await randomNumber.connect(owner1).until()).to.equal(999999);
            expect(await randomNumber.connect(owner1).randomResult()).to.equal(0);
        });

        it("The 'Until' value must be modified", async ()=> {
            await randomNumber.connect(owner1).setUntil(999998);
            expect(await randomNumber.connect(owner1).until()).to.equal(999998);
        });

        it("Should return a random number in the given range", async ()=> {
            await randomNumber.connect(owner2).getRandomNumber();
            let requestId = await randomNumber.connect(owner1).lastRequestId();

            await vrfCoordinator.connect(owner1).callBackWithRandomness(
                requestId,
                "777",
                randomNumber.address
            );
            let value = await randomNumber.connect(owner1).randomResult();

            assert(value > 0);
            assert(value <= 999998);
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
            await expect(randomNumber.connect(owner1).withdrawFunds(
                true,
                "0x0000000000000000000000000000000000000000"
            )).to.be.revertedWith("Error: Invalid token address");
        });

        it("Withdraw tokens and BNB", async ()=> {
            await randomNumber.connect(owner1).withdrawFunds(
                true,
                link.address
            )

            expect(await ethers.provider.getBalance(randomNumber.address)).to.equal(0);
            expect(await link.connect(owner1).balanceOf(
                randomNumber.address
            )).to.equal(0);
        });
    });
});