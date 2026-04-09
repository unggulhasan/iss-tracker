import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ISS Live Tracker',
  description: 'Real-time International Space Station position tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
