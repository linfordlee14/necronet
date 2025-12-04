import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🎃 NecroNet — Resurrecting Dead Tech',
  description: 'Upload obsolete web artifacts. AI resurrects them. A spooky museum for digital preservation.',
  keywords: ['Flash', 'GeoCities', 'web preservation', 'digital archaeology', 'Ruffle'],
  openGraph: {
    title: '🎃 NecroNet — Resurrecting Dead Tech',
    description: 'Upload obsolete web artifacts. AI resurrects them.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/ruffle-rs@latest/dist/ruffle.js"
          async
        />
      </head>
      <body className="min-h-screen bg-necro-bg text-necro-text antialiased">
        {children}
      </body>
    </html>
  );
}
