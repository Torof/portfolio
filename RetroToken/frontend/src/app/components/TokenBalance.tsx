export default function TokenBalance({ balance }: { balance: string }) {
    return (
      <div className="retro-terminal mb-6">
        <h2 className="text-xl mb-2 text-retroPink">TOKEN BALANCE</h2>
        <div className="retro-text-box">
          <span className="text-2xl text-retroYellow">{balance} RTK</span>
          <span className="retro-cursor"></span>
        </div>
      </div>
    );
  }