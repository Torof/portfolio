// src/app/providers/Web3Provider.tsx
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, hardhat, type Chain } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

// Create a client
const queryClient = new QueryClient();

// Get chain ID from environment
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID ? 
  Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 31337;

// Define the primary chain and create a properly typed array
const primaryChain = chainId === 31337 ? hardhat : sepolia;
// This creates a tuple type with at least one Chain element
const chains = [primaryChain] as const;

// Configure Rainbow Kit
const { connectors } = getDefaultWallets({
  appName: 'RetroToken DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

// Create wagmi config
const wagmiConfig = createConfig({
  chains,
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
  },
  connectors,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#8A2BE2', // Purple accent
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}