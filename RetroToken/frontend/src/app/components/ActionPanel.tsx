import { ChangeEvent } from 'react';

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
  // Handle amount input to ensure it's a valid number
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="retro-terminal mb-6">
      <h2 className="text-xl mb-2 text-retroPink">TOKEN ACTIONS</h2>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button 
          className={`action-button ${action === 'mint' ? 'active' : ''}`}
          onClick={() => setAction('mint')}
        >
          Mint
        </button>
        <button 
          className={`action-button ${action === 'burn' ? 'active' : ''}`}
          onClick={() => setAction('burn')}
        >
          Burn
        </button>
        <button 
          className={`action-button ${action === 'transfer' ? 'active' : ''}`}
          onClick={() => setAction('transfer')}
        >
          Transfer
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-retroYellow">AMOUNT</label>
        <input
          type="text"
          className="retro-input"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />
      </div>
      
      {action === 'transfer' && (
        <div className="mb-4">
          <label className="block mb-2 text-retroYellow">RECIPIENT ADDRESS</label>
          <input
            type="text"
            className="retro-input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>
      )}
      
      <button 
        className="retro-button w-full"
        onClick={executeAction}
        disabled={isPending || !amount || (action === 'transfer' && !recipient)}
      >
        {isPending ? 'Processing...' : `Execute ${action}`}
      </button>
    </div>
  );
}