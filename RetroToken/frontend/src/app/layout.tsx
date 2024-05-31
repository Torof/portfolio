import type { Metadata } from 'next';
import { VT323, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { Web3Provider } from './providers/Web3Provider';

// Load retro fonts
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
});

export const metadata: Metadata = {
  title: 'RetroToken DApp',
  description: 'A retro-themed ERC20 token DApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${pressStart2P.variable}`}>
        <div className="pixel-effect"></div>
        <div className="retro-scanlines"></div>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}