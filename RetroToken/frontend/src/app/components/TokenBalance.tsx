'use client';

import { useEffect, useState } from 'react';

export default function TokenBalance({ balance }: { balance: string }) {
  // Use client-side only rendering to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before hydration, render a placeholder with identical structure
  if (!mounted) {
    return (
      <div className="retro-terminal mb-6">
        <h2 className="text-xl mb-2 text-retroPink">TOKEN BALANCE</h2>
        <div className="retro-text-box">
          <span className="text-2xl text-retroYellow">0 RTK</span>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-terminal mb-6">
      <h2 className="text-xl mb-2 text-retroPink">TOKEN BALANCE</h2>
      <div className="retro-text-box">
        <span className="text-2xl text-retroYellow">{balance} RTK</span>
      </div>
    </div>
  );
}