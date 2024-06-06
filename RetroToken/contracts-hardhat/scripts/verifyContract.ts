import fs from 'fs';
import path from 'path';

async function main() {
  try {
    // Get Hardhat runtime
    const hre = require('hardhat');
    console.log('Starting contract verification...');
    
    // Get network
    const network = hre.network.name;
    console.log(`Verifying on network: ${network}`);
    
    // Determine chain ID based on network
    const chainId = network === 'sepolia' ? 11155111 : 31337;
    const chainFolder = `chain-${chainId}`;
    
    // Find the deployed contract address
    let contractAddress = '';
    const deploymentDir = path.join(__dirname, '../ignition/deployments');
    const networkDir = path.join(deploymentDir, chainFolder);
    
    console.log(`Looking for deployment in: ${networkDir}`);
    
    if (fs.existsSync(networkDir)) {
      // Find the most recent deployment
      const addressesPath = path.join(networkDir, 'deployed_addresses.json');
      
      if (fs.existsSync(addressesPath)) {
        console.log(`Reading addresses from: ${addressesPath}`);
        const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
        
        // Find RetroToken contract address
        for (const [key, value] of Object.entries(addresses)) {
          console.log(`Found contract: ${key} -> ${value}`);
          if (key.includes('RetroToken')) {
            contractAddress = value as string;
            console.log(`Using contract address: ${contractAddress}`);
            break;
          }
        }
      } else {
        console.log(`No deployed_addresses.json found in ${networkDir}`);
      }
    } else {
      console.log(`Network directory not found: ${networkDir}`);
    }
    
    // If we still don't have an address, try reading from .env.local
    if (!contractAddress) {
      console.log('Address not found in deployment files, checking .env.local');
      const envPath = path.join(__dirname, '../../frontend/.env.local');
      
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const addressMatch = envContent.match(/NEXT_PUBLIC_CONTRACT_ADDRESS=(.+)/);
        
        if (addressMatch && addressMatch[1]) {
          contractAddress = addressMatch[1];
          console.log(`Found address in .env.local: ${contractAddress}`);
        }
      }
    }
    
    // If we have an address, verify the contract
    if (contractAddress) {
      console.log(`Attempting to verify contract at address: ${contractAddress}`);
      
      try {
        // Use the Hardhat verify task
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: []
        });
        
        console.log('Contract verification successful!');
      } catch (error: any) {
        if (error.message?.includes('Already Verified')) {
          console.log('Contract is already verified on Etherscan.');
        } else {
          console.error('Error during verification:', error);
        }
      }
    } else {
      console.error('Could not find a contract address to verify');
    }
  } catch (error) {
    console.error('Verification script error:', error);
  }
}

// This allows the script to be run directly from Hardhat
module.exports = main;