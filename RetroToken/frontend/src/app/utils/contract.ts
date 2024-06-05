import contractAbi from '../abis/RetroToken.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
export const CONTRACT_ABI = contractAbi;

export type Transaction = {
  type: 'mint' | 'burn' | 'transfer';
  amount: string;
  to?: string;
  hash: string;
  timestamp: number;
};

export function getExplorerUrl(hash: string): string {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '31337';
  
  if (chainId === '11155111') {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  } else if (chainId === '31337') {
    return `#`;
  }
  
  return `https://etherscan.io/tx/${hash}`;
}