// The ABI will be automatically copied from our updateFrontend script
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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
  }
  
  // For local development
  return `#`;
}