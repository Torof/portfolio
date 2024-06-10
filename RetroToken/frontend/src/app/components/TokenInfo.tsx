'use client';

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import { useEffect } from 'react';

// Define props interface within the file
type TokenInfoProps = {
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
};

export default function TokenInfo({ 
  shouldRefresh, 
  onRefreshComplete 
}: TokenInfoProps) {
  
  // Read basic token info
  const { data: name, refetch: refetchName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'name',
  });

  const { data: symbol, refetch: refetchSymbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'symbol',
  });

  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
  });

  const { data: decimals, refetch: refetchDecimals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'decimals',
  });

  // Refresh all data when shouldRefresh changes to true
  useEffect(() => {
    if (shouldRefresh) {
      console.log('Refreshing TokenInfo data');
      Promise.all([
        refetchName(),
        refetchSymbol(),
        refetchTotalSupply(),
        refetchDecimals()
      ]).then(() => {
        console.log('TokenInfo refresh complete');
        onRefreshComplete();
      });
    }
  }, [shouldRefresh, refetchName, refetchSymbol, refetchTotalSupply, refetchDecimals, onRefreshComplete]);

  return (
    <div className="retro-terminal h-full">
      <h2 className="text-xl mb-4 text-retroPink text-center md:text-left">TOKEN INFO</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-retroYellow mb-1">Name</p>
          <div className="retro-text-box py-2">
            {name ? String(name) : 'Loading...'}
          </div>
        </div>
        
        <div>
          <p className="text-retroYellow mb-1">Symbol</p>
          <div className="retro-text-box py-2">
            {symbol ? String(symbol) : 'Loading...'}
          </div>
        </div>
        
        <div>
          <p className="text-retroYellow mb-1">Total Supply</p>
          <div className="retro-text-box py-2">
            {totalSupply ? formatEther(totalSupply as bigint) : 'Loading...'}
          </div>
        </div>
        
        <div>
          <p className="text-retroYellow mb-1">Decimals</p>
          <div className="retro-text-box py-2">
            {decimals !== null ? String(decimals) : 'Loading...'}
          </div>
        </div>
        
        <div>
          <p className="text-retroYellow mb-1">Contract</p>
          <div className="retro-text-box py-2 text-xs break-all">
            {CONTRACT_ADDRESS}
          </div>
        </div>
      </div>
    </div>
  );
}