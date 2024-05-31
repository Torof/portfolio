'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESS, Transaction, getExplorerUrl } from './utils/contract';
import TokenBalance from './components/TokenBalance';
import ActionPanel from './components/ActionPanel';
import TransactionHistory from './components/TransactionHistory';
import Navbar from './components/Navbar';

// Import the ABI (it will be available after running updateFrontend)
import contractAbi from './abis/RetroToken.json';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [action, setAction] = useState<'mint' | 'burn' | 'transfer'>('mint');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');

  // Read balance - only fetch when connected and address exists
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: Boolean(isConnected && address),
    }
  });

  // Write to contract
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Transaction state
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    });

  // Execute action
  const executeAction = () => {
    if (!isConnected || !amount) return;

    try {
      const parsedAmount = parseEther(amount);
      
      if (action === 'mint') {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: contractAbi,
          functionName: 'mint',
          args: [parsedAmount],
        });
      } else if (action === 'burn') {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: contractAbi,
          functionName: 'burn',
          args: [parsedAmount],
        });
      } else if (action === 'transfer' && recipient) {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: contractAbi,
          functionName: 'transfer',
          args: [recipient, parsedAmount],
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  // Add transaction to history when confirmed
  useEffect(() => {
    if (hash && isConfirmed) {
      const newTransaction: Transaction = {
        type: action,
        amount,
        hash: hash.toString(),
        timestamp: Date.now(),
        ...(action === 'transfer' && { to: recipient })
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reset form
      setAmount('');
      if (action === 'transfer') setRecipient('');
      
      // Refetch balance after transaction
      refetchBalance();
    }
  }, [isConfirmed, hash, action, amount, recipient, refetchBalance]);

  // Also refetch balance when connection state changes
  useEffect(() => {
    if (isConnected && address) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-center text-2xl mb-6 text-retroYellow">RetroToken Terminal</h1>
        
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
            
            <TransactionHistory 
              transactions={transactions} 
              getExplorerUrl={getExplorerUrl}
            />
          </>
        ) : (
          <div className="text-center py-10 retro-terminal">
            <p className="text-xl mb-4 text-retroPink">Connect your wallet to access the RetroToken Terminal</p>
            <div className="retro-cursor"></div>
          </div>
        )}
      </main>
    </>
  );
}