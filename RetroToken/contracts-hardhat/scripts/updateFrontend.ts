// scripts/updateFrontend.ts
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    console.log('Starting frontend update...');
    
    // Path to the contract artifact (ABI)
    const artifactPath = path.join(__dirname, '../artifacts/contracts/RetroToken.sol/RetroToken.json');
    console.log(`Looking for contract artifact at: ${artifactPath}`);
    
    if (!fs.existsSync(artifactPath)) {
      console.error(`Contract artifact not found at ${artifactPath}`);
      console.log('Please make sure you have compiled the contract first.');
      return;
    }
    
    // Path to the frontend ABI directory
    const frontendAbiDir = path.join(__dirname, '../../frontend/src/app/abis');
    const frontendAbiPath = path.join(frontendAbiDir, 'RetroToken.json');
    
    console.log(`Creating directory (if needed): ${frontendAbiDir}`);
    
    // Create the frontend directory if it doesn't exist
    if (!fs.existsSync(frontendAbiDir)) {
      fs.mkdirSync(frontendAbiDir, { recursive: true });
    }
    
    // Read the artifact file
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    // Extract only the ABI
    const abi = artifact.abi;
    
    // Write the ABI to the frontend
    fs.writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));
    
    console.log(`ABI successfully written to ${frontendAbiPath}`);
    
    // Update the .env.local file with contract address
    try {
      // Get information about deployments
      const deploymentDir = path.join(__dirname, '../ignition/deployments');
      
      // Determine network based on Hardhat config
      // Default to localhost for testing
      const hre = require('hardhat');
      const network = hre.network.name;
      const chainId = network === 'localhost' || network === 'hardhat' ? 31337 : 11155111;
      console.log(`Detected network: ${network} (chainId: ${chainId})`);
      
      const networkDir = path.join(deploymentDir, `chain-${chainId}`);
      
      if (fs.existsSync(networkDir)) {
        console.log(`Found deployment directory: ${networkDir}`);
        
        // Find deployment addresses
        const addressesPath = path.join(networkDir, 'deployed_addresses.json');
        
        if (fs.existsSync(addressesPath)) {
          const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
          
          // Find the RetroToken contract address
          let contractAddress = '';
          
          console.log('Looking for RetroToken contract address...');
          for (const [key, value] of Object.entries(addresses)) {
            console.log(`Checking key: ${key}`);
            if (key.includes('RetroToken')) {
              contractAddress = value as string;
              console.log(`Found address: ${contractAddress}`);
              break;
            }
          }
          
          if (contractAddress) {
            // Update .env.local
            const envPath = path.join(__dirname, '../../frontend/.env.local');
            const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
NEXT_PUBLIC_CHAIN_ID=${chainId}`;
            
            console.log(`Updating frontend .env.local at: ${envPath}`);
            fs.writeFileSync(envPath, envContent);
            console.log(`Updated frontend .env.local with address: ${contractAddress} on chain ID: ${chainId}`);
          } else {
            console.log('RetroToken contract address not found in deployment file.');
          }
        } else {
          console.log(`Deployment addresses file not found at: ${addressesPath}`);
        }
      } else {
        console.log(`No deployment directory found at: ${networkDir}`);
      }
    } catch (error) {
      console.error('Error updating contract address:', error);
    }
  } catch (error) {
    console.error('Error updating frontend:', error);
  }
}

// This allows running the script directly with Hardhat
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });