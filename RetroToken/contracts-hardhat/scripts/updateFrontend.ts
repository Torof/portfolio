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
      
      // Determine network based on command line args or Hardhat config
      const hre = require('hardhat');
      let network = hre.network.name;
      
      // Check for network argument
      const networkArg = process.argv.find(arg => 
        arg === 'sepolia' || arg === 'localhost' || arg === 'hardhat'
      );
      
      if (networkArg) {
        network = networkArg;
        console.log(`Using network from command argument: ${network}`);
      } else if (process.env.HARDHAT_NETWORK) {
        network = process.env.HARDHAT_NETWORK;
        console.log(`Using network from environment variable: ${network}`);
      }
      
      console.log(`Current network: ${network}`);
      
      const chainId = network === 'sepolia' ? 11155111 : 31337;
      console.log(`Using chainId: ${chainId}`);
      
      let contractAddress = '';
      
      if (network === 'sepolia') {
        // Look in Sepolia deployments
        const sepoliaDir = path.join(deploymentDir, 'chain-11155111');
        if (fs.existsSync(sepoliaDir)) {
          const addressesPath = path.join(sepoliaDir, 'deployed_addresses.json');
          if (fs.existsSync(addressesPath)) {
            const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
            for (const [key, value] of Object.entries(addresses)) {
              if (key.includes('RetroToken')) {
                contractAddress = value as string;
                console.log(`Found Sepolia address: ${contractAddress}`);
                break;
              }
            }
          }
        }
        
        // If still not found, use the known Sepolia address
        if (!contractAddress) {
          contractAddress = '0x9A1952B7A518b6c421daB076d0Ba86084ca48662';
          console.log(`Using known Sepolia address: ${contractAddress}`);
        }
      } else {
        // Look in local deployments
        const localDir = path.join(deploymentDir, 'chain-31337');
        if (fs.existsSync(localDir)) {
          const addressesPath = path.join(localDir, 'deployed_addresses.json');
          if (fs.existsSync(addressesPath)) {
            const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
            for (const [key, value] of Object.entries(addresses)) {
              if (key.includes('RetroToken')) {
                contractAddress = value as string;
                console.log(`Found local address: ${contractAddress}`);
                break;
              }
            }
          }
        }
      }
      
      if (contractAddress) {
        // Update .env.local while preserving other variables
        const envPath = path.join(__dirname, '../../frontend/.env.local');
        let envContent = '';
        
        // Read existing env file if it exists
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, 'utf8');
          
          // Update or add CONTRACT_ADDRESS
          const addressRegex = /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/;
          if (addressRegex.test(envContent)) {
            envContent = envContent.replace(addressRegex, `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
          } else {
            envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
          }
          
          // Update or add CHAIN_ID
          const chainIdRegex = /NEXT_PUBLIC_CHAIN_ID=.*/;
          if (chainIdRegex.test(envContent)) {
            envContent = envContent.replace(chainIdRegex, `NEXT_PUBLIC_CHAIN_ID=${chainId}`);
          } else {
            envContent += `\nNEXT_PUBLIC_CHAIN_ID=${chainId}`;
          }
        } else {
          // Create new env file if it doesn't exist
          envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_CHAIN_ID=${chainId}`;
        }
        
        console.log(`Updating frontend .env.local at: ${envPath}`);
        fs.writeFileSync(envPath, envContent);
        console.log(`Updated frontend .env.local with address: ${contractAddress} on chain ID: ${chainId}`);
      } else {
        console.log('RetroToken contract address not found in deployment file.');
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