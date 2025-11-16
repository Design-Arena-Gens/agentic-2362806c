import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jurnal Saya',
  description: 'Aplikasi jurnal sederhana untuk menulis catatan harian.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav className="navbar">
          <div className="navbar-inner container">
            <Link href="/" className="brand">Jurnal Saya</Link>
            <div className="spacer" />
            <Link href="/new" className="button secondary">Tulis Entri</Link>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer>
          Dibuat dengan Next.js ? Data tersimpan di peramban Anda
        </footer>
      </body>
    </html>
  );
}
