"use client";

import Link from 'next/link';
import EntryList from "@/app/components/EntryList";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Jurnal</h1>
        <div className="spacer" />
        <Link className="button secondary" href="/new">Tulis Entri</Link>
      </div>
      <EntryList />
    </div>
  );
}
