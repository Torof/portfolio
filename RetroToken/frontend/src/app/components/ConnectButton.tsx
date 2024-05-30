'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Use a state variable to track client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after the component has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During server-side rendering, render a placeholder
  if (!mounted) {
    return <button className="retro-button">Connect Wallet</button>;
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-end">
        <p className="mb-2 text-sm text-retroYellow">
          {`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
        </p>
        <button 
          onClick={() => disconnect()} 
          className="retro-button"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => connect({ connector: injected() })} 
      className="retro-button"
    >
      Connect Wallet
    </button>
  );
}