'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI, Transaction, getExplorerUrl } from './utils/contract';
import TokenBalance from './components/TokenBalance';
import ActionPanel from './components/ActionPanel';
import TransactionHistory from './components/TransactionHistory';
import TokenInfo from './components/TokenInfo';
import Navbar from './components/Navbar';

// Client-only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default function Home() {
  const [shouldRefreshInfo, setShouldRefreshInfo] = useState(false);
  
  const handleInfoRefreshComplete = () => {
    setShouldRefreshInfo(false);
  };
  
  return (
    <>
      <Navbar />
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar at extreme left */}
        <div className="w-full md:w-1/5 px-4 md:pl-8 py-8">
          <ClientOnly>
            {/* Pass props directly, don't use type from import */}
            <TokenInfo 
              shouldRefresh={shouldRefreshInfo} 
              onRefreshComplete={handleInfoRefreshComplete} 
            />
          </ClientOnly>
        </div>
        
        {/* Main content with constrained width */}
        <div className="md:w-4/5 py-8">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-center text-2xl mb-6 text-retroYellow">RetroToken Terminal</h1>
            
            <ClientOnly>
              <AppContent 
                setShouldRefreshInfo={setShouldRefreshInfo} 
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </>
  );
}

// Props for AppContent to allow refreshing TokenInfo
type AppContentProps = {
  setShouldRefreshInfo: (value: boolean) => void;
};

// Main content component with all web3 dependent code
function AppContent({ setShouldRefreshInfo }: AppContentProps) {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [action, setAction] = useState<'mint' | 'burn' | 'transfer'>('mint');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [latestTxHash, setLatestTxHash] = useState<`0x${string}` | undefined>(undefined);

  // Retrieve balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(isConnected && address),
    }
  });

  // Wait for transaction receipt - only if we have a hash
  const waitForTxResult = useWaitForTransactionReceipt(
    latestTxHash ? { hash: latestTxHash } : { hash: undefined as any }
  );

  const isConfirming = latestTxHash ? waitForTxResult.isLoading : false;
  const isConfirmed = latestTxHash ? waitForTxResult.isSuccess : false;

  // Effect to handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && !isConfirming && latestTxHash) {
      console.log('Transaction confirmed, refreshing data');
      
      // Clear the transaction hash after handling
      setLatestTxHash(undefined);
      
      // Refetch balance immediately and again after a short delay
      refetchBalance();
      
      // Set flag to refresh token info
      setShouldRefreshInfo(true);
      
      // After a delay, refetch balance and transaction history
      setTimeout(() => {
        refetchBalance();
        fetchTransactionHistory();
      }, 5000); // 5 seconds should be enough for the blockchain state to update
    }
  }, [isConfirmed, isConfirming, latestTxHash, refetchBalance, setShouldRefreshInfo]);

  // Write contract
  const { writeContractAsync, isPending } = useWriteContract();

  // Fetch transaction history from subgraph
  const fetchTransactionHistory = async () => {
    if (!address) return;
    
    setIsLoadingHistory(true);
    try {
      // Import the fetchUserTransactions function
      const { fetchUserTransactions } = await import('./utils/subgraphClient');
      const subgraphTxs = await fetchUserTransactions(address);
      
      // Use only the subgraph transactions for complete history
      setTransactions(subgraphTxs);
    } catch (error) {
      console.error("Error fetching transactions from subgraph:", error);
      // Show error message
      setError("Failed to load transaction history. Please try again later.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // When address changes, reset error, refetch balance, and fetch transaction history
  useEffect(() => {
    if (isConnected && address) {
      setError(null);
      refetchBalance();
      fetchTransactionHistory();
    } else {
      // Clear transactions when wallet disconnects
      setTransactions([]);
    }
  }, [isConnected, address, refetchBalance]);

  // Execute action (mint, burn, transfer)
  const executeAction = async () => {
    if (!isConnected || !amount) {
      setError("Please connect wallet and enter an amount");
      return;
    }

    try {
      setError(null);
      const parsedAmount = parseEther(amount);
      let hash;

      if (action === 'mint') {
        hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'mint',
          args: [parsedAmount],
        });
      } else if (action === 'burn') {
        hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'burn',
          args: [parsedAmount],
        });
      } else if (action === 'transfer') {
        if (!recipient) {
          setError("Please enter a recipient address");
          return;
        }
        hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'transfer',
          args: [recipient, parsedAmount],
        });
      }

      // Store transaction hash to wait for confirmation
      if (hash) {
        setLatestTxHash(hash);
        
        // Reset form
        setAmount('');
        if (action === 'transfer') setRecipient('');
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setError(error instanceof Error ? error.message : "Transaction failed");
    }
  };

  return (
    <>
      {error && (
        <div className="retro-terminal mb-6 bg-red-900 border-red-500">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      {isConnected ? (
        <>
          <TokenBalance balance={balance ? formatEther(balance as bigint) : '0'} />
          
          <ActionPanel 
            action={action}
            setAction={setAction}
            amount={amount}
            setAmount={setAmount}
            recipient={recipient}
            setRecipient={setRecipient}
            executeAction={executeAction}
            isPending={isPending || isConfirming}
          />
          
          {isLoadingHistory ? (
            <div className="retro-terminal mb-6">
              <h2 className="text-xl mb-2 text-retroPink">TRANSACTION HISTORY</h2>
              <div className="retro-text-box flex items-center justify-center h-20">
                <p>Loading transaction history...</p>
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <TransactionHistory 
              transactions={transactions} 
              getExplorerUrl={getExplorerUrl}
            />
          ) : (
            <div className="retro-terminal mb-6">
              <h2 className="text-xl mb-2 text-retroPink">TRANSACTION HISTORY</h2>
              <div className="retro-text-box flex items-center justify-center h-20">
                <p>No transactions found for this address. Transactions may take a few minutes to appear after they are made.</p>
              </div>
            </div>
          )}

          {/* Add refresh button */}
          <div className="text-center mt-2 mb-6">
            <button 
              onClick={() => {
                fetchTransactionHistory();
                refetchBalance();
                setShouldRefreshInfo(true);
              }}
              className="text-retroBlue hover:text-retroPink text-sm"
              disabled={isLoadingHistory}
            >
              {isLoadingHistory ? 'Refreshing...' : 'Refresh all data'}
            </button>
          </div>
        </>
      ) : (
        <div className="retro-terminal mb-6">
          <h2 className="text-xl mb-2 text-retroPink">CONNECT WALLET</h2>
          <div className="retro-text-box text-center py-4">
            <p>Connect your wallet to access the RetroToken Terminal</p>
          </div>
        </div>
      )}
    </>
  );
}