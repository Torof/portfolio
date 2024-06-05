'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
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
  return (
    <>
      <Navbar />
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar at extreme left */}
        <div className="w-full md:w-1/5 px-4 md:pl-8 py-8">
          <ClientOnly>
            <TokenInfo />
          </ClientOnly>
        </div>
        
        {/* Main content with constrained width */}
        <div className="md:w-4/5 py-8">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-center text-2xl mb-6 text-retroYellow">RetroToken Terminal</h1>
            
            <ClientOnly>
              <AppContent />
            </ClientOnly>
          </div>
        </div>
      </div>
    </>
  );
}


// Move all web3 dependent code to a separate component
function AppContent() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [action, setAction] = useState<'mint' | 'burn' | 'transfer'>('mint');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  // Write contract
  const { writeContractAsync, isPending } = useWriteContract();

  // When address changes, reset error and refetch balance
  useEffect(() => {
    if (isConnected && address) {
      setError(null);
      refetchBalance();
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

      // Wait for transaction confirmation
      if (hash) {
        // Add transaction to history
        const newTransaction: Transaction = {
          type: action,
          amount,
          hash,
          timestamp: Date.now(),
          ...(action === 'transfer' && { to: recipient })
        };

        setTransactions(prev => [newTransaction, ...prev]);
        
        // Reset form
        setAmount('');
        if (action === 'transfer') setRecipient('');
        
        // Refetch balance after transaction
        setTimeout(() => {
          refetchBalance();
        }, 2000); // Give the blockchain a moment to update
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
            isPending={isPending}
          />
          
          <TransactionHistory 
            transactions={transactions} 
            getExplorerUrl={getExplorerUrl}
          />
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