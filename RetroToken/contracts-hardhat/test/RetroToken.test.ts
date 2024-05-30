import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { getAddress, parseEther } from "viem";

describe("RetroToken", function () {
  // Deploy the contract once and reuse it for all tests
  async function deployRetroTokenFixture() {
    // Get wallet clients for testing
    const [deployer, otherAccount] = await hre.viem.getWalletClients();
    
    // Deploy the RetroToken contract
    const retroToken = await hre.viem.deployContract("RetroToken");
    
    // Get public client for contract interactions
    const publicClient = await hre.viem.getPublicClient();

    return { retroToken, deployer, otherAccount, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { retroToken, publicClient } = await loadFixture(deployRetroTokenFixture);
      
      const name = await retroToken.read.name();
      const symbol = await retroToken.read.symbol();
      
      expect(name).to.equal("RetroToken");
      expect(symbol).to.equal("RTK");
    });

    it("Should set the deployer as the owner", async function () {
      const { retroToken, deployer } = await loadFixture(deployRetroTokenFixture);
      
      const owner = await retroToken.read.owner();
      
      expect(getAddress(owner)).to.equal(getAddress(deployer.account.address));
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to the caller", async function () {
      const { retroToken, deployer } = await loadFixture(deployRetroTokenFixture);
      const mintAmount = parseEther("100");
      
      // Check initial balance is 0
      const initialBalance = await retroToken.read.balanceOf([deployer.account.address]);
      expect(initialBalance).to.equal(0n);
      
      // Mint tokens
      const tx = await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Check final balance
      const finalBalance = await retroToken.read.balanceOf([deployer.account.address]);
      
      expect(finalBalance).to.equal(mintAmount);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens from the caller", async function () {
      const { retroToken, deployer } = await loadFixture(deployRetroTokenFixture);
      const mintAmount = parseEther("100");
      const burnAmount = parseEther("30");
      
      // Mint tokens first
      await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Check balance after minting
      const balanceAfterMint = await retroToken.read.balanceOf([deployer.account.address]);
      expect(balanceAfterMint).to.equal(mintAmount);
      
      // Burn tokens
      await retroToken.write.burn([burnAmount], { account: deployer.account });
      
      // Check balance after burning
      const finalBalance = await retroToken.read.balanceOf([deployer.account.address]);
      
      expect(finalBalance).to.equal(mintAmount - burnAmount);
    });
    
    it("Should revert when trying to burn more tokens than owned", async function () {
      const { retroToken, deployer } = await loadFixture(deployRetroTokenFixture);
      const mintAmount = parseEther("10");
      const burnAmount = parseEther("20");
      
      // Mint tokens first
      await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Try to burn more tokens than owned
      await expect(
        retroToken.write.burn([burnAmount], { account: deployer.account })
      ).to.be.rejected;
    });
  });

  describe("Transferring", function () {
    it("Should transfer tokens between accounts", async function () {
      const { retroToken, deployer, otherAccount } = await loadFixture(deployRetroTokenFixture);
      const mintAmount = parseEther("100");
      const transferAmount = parseEther("50");
      
      // Mint tokens first
      await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Transfer tokens
      await retroToken.write.transfer(
        [otherAccount.account.address, transferAmount], 
        { account: deployer.account }
      );
      
      // Check balances
      const senderBalance = await retroToken.read.balanceOf([deployer.account.address]);
      const receiverBalance = await retroToken.read.balanceOf([otherAccount.account.address]);
      
      expect(senderBalance).to.equal(mintAmount - transferAmount);
      expect(receiverBalance).to.equal(transferAmount);
    });
    
    it("Should fail when trying to transfer more tokens than owned", async function () {
      const { retroToken, deployer, otherAccount } = await loadFixture(deployRetroTokenFixture);
      const mintAmount = parseEther("10");
      const transferAmount = parseEther("20");
      
      // Mint tokens first
      await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Try to transfer more tokens than owned
      await expect(
        retroToken.write.transfer(
          [otherAccount.account.address, transferAmount], 
          { account: deployer.account }
        )
      ).to.be.rejected;
    });
  });

  describe("Total Supply", function () {
    it("Should track the total supply correctly", async function () {
      const { retroToken, deployer } = await loadFixture(deployRetroTokenFixture);
      
      // Check initial supply is 0
      const initialSupply = await retroToken.read.totalSupply();
      expect(initialSupply).to.equal(0n);
      
      // Mint tokens
      const mintAmount = parseEther("100");
      await retroToken.write.mint([mintAmount], { account: deployer.account });
      
      // Check supply after minting
      const supplyAfterMint = await retroToken.read.totalSupply();
      expect(supplyAfterMint).to.equal(mintAmount);
      
      // Burn tokens
      const burnAmount = parseEther("30");
      await retroToken.write.burn([burnAmount], { account: deployer.account });
      
      // Check supply after burning
      const finalSupply = await retroToken.read.totalSupply();
      expect(finalSupply).to.equal(mintAmount - burnAmount);
    });
  });
});