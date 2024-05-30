'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="retro-terminal mb-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-retroHeading text-retroPink">RetroToken</div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} className="retro-button">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} className="retro-button bg-retroPink text-retroDark">
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <div className="flex flex-col items-end">
                      <p className="mb-2 text-sm text-retroYellow">
                        {account.displayName}
                      </p>
                      <button onClick={openAccountModal} className="retro-button">
                        Disconnect
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}