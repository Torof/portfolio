// src/app/components/ActionPanel.tsx
import { ChangeEvent, useState } from 'react';

type ActionPanelProps = {
  action: 'mint' | 'burn' | 'transfer';
  setAction: (action: 'mint' | 'burn' | 'transfer') => void;
  amount: string;
  setAmount: (amount: string) => void;
  recipient: string;
  setRecipient: (recipient: string) => void;
  executeAction: () => void;
  isPending: boolean;
};

export default function ActionPanel({
  action,
  setAction,
  amount,
  setAmount,
  recipient,
  setRecipient,
  executeAction,
  isPending
}: ActionPanelProps) {
  // Add state to track input focus
  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);
  const [isRecipientFocused, setIsRecipientFocused] = useState<boolean>(false);
  
  // Handle amount input to ensure it's a valid number
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Clear the form when changing action
  const handleActionChange = (newAction: 'mint' | 'burn' | 'transfer') => {
    if (newAction !== action) {
      setAction(newAction);
      setAmount('');
      if (newAction !== 'transfer') {
        setRecipient('');
      }
    }
  };

  const isButtonDisabled = isPending || !amount || (action === 'transfer' && !recipient);

  return (
    <div className="retro-terminal mb-6">
      <h2 className="text-xl mb-2 text-retroPink">TOKEN ACTIONS</h2>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button 
          className={`action-button ${action === 'mint' ? 'active' : ''}`}
          onClick={() => handleActionChange('mint')}
        >
          Mint
        </button>
        <button 
          className={`action-button ${action === 'burn' ? 'active' : ''}`}
          onClick={() => handleActionChange('burn')}
        >
          Burn
        </button>
        <button 
          className={`action-button ${action === 'transfer' ? 'active' : ''}`}
          onClick={() => handleActionChange('transfer')}
        >
          Transfer
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-retroYellow">AMOUNT</label>
        <div className="relative">
          <input
            type="text"
            className="retro-input pl-8 w-full"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
          />
          
          {/* Only show cursor */}
          {isAmountFocused && (
            <span 
              className="retro-cursor absolute top-1/2 transform -translate-y-1/2 z-10"
              style={{ 
                left: `calc(2rem + ${amount.length * 0.65}ch)`, // Approximate character width
              }}
            ></span>
          )}
        </div>
      </div>
      
      {action === 'transfer' && (
        <div className="mb-4">
          <label className="block mb-2 text-retroYellow">RECIPIENT ADDRESS</label>
          <div className="relative">
            <input
              type="text"
              className="retro-input pl-8 w-full"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              onFocus={() => setIsRecipientFocused(true)}
              onBlur={() => setIsRecipientFocused(false)}
            />
            
            {/* Only show cursor */}
            {isRecipientFocused && (
              <span 
                className="retro-cursor absolute top-1/2 transform -translate-y-1/2 z-10"
                style={{ 
                  left: `calc(2rem + ${recipient.length * 0.6}ch)`, // Approximate character width
                }}
              ></span>
            )}
          </div>
        </div>
      )}
      
      <button 
        className={`retro-button w-full ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={executeAction}
        disabled={isButtonDisabled}
      >
        {isPending ? 'Processing...' : `Execute ${action}`}
      </button>
      
      <div className="mt-3 text-xs text-retroYellow opacity-70">
        {action === 'mint' && "Mint tokens to your wallet"}
        {action === 'burn' && "Burn tokens from your wallet"}
        {action === 'transfer' && "Transfer tokens to another wallet"}
      </div>
    </div>
  );
}