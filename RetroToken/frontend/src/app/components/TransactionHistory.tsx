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
          <div className="flex items-center justify-center h-20">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div>
            {transactions.map((tx, index) => (
              <div key={index} className="transaction-item mb-3 pb-3 border-b border-retroPurple/30 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="text-retroYellow font-bold">
                      {tx.type.toUpperCase()}
                    </p>
                    <p>
                      {tx.type === 'mint' && `Minted ${tx.amount} RTK tokens`}
                      {tx.type === 'burn' && `Burned ${tx.amount} RTK tokens`}
                      {tx.type === 'transfer' && tx.to && `Transferred ${tx.amount} RTK tokens to ${tx.to?.substring(0, 6)}...${tx.to?.substring(tx.to.length - 4)}`}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                    <a 
                      href={getExplorerUrl(tx.hash)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-retroBlue hover:text-retroPink"
                    >
                      View on Etherscan
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}