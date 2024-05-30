import { Transaction } from '../utils/contract';

type TransactionHistoryProps = {
  transactions: Transaction[];
  getExplorerUrl: (hash: string) => string;
};

export default function TransactionHistory({ 
  transactions, 
  getExplorerUrl 
}: TransactionHistoryProps) {
  return (
    <div className="retro-terminal mb-6">
      <h2 className="text-xl mb-2 text-retroPink">TRANSACTION HISTORY</h2>
      <div className="retro-text-box">
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((tx, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-label">
                <p>
                  {tx.type === 'mint' && `Minted ${tx.amount} tokens`}
                  {tx.type === 'burn' && `Burned ${tx.amount} tokens`}
                  {tx.type === 'transfer' && `Transferred ${tx.amount} tokens to ${tx.to}`}
                </p>
                <p>
                  <a 
                    href={getExplorerUrl(tx.hash)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transaction-link"
                  >
                    View on Etherscan
                  </a>
                </p>
              </div>
            </div>
          ))
        )}
        <span className="retro-cursor"></span>
      </div>
    </div>
  );
}