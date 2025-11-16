"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { JournalEntry } from "@/app/types";
import { createBrowserStorage } from "@/app/lib/storage";

const storage = createBrowserStorage<JournalEntry>();

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function EntryList() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(storage.getAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(e => e.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(e => {
      const matchQ = !q || e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
      const matchT = !tag || e.tags.includes(tag);
      return matchQ && matchT;
    });
  }, [entries, query, tag]);

  if (entries.length === 0) {
    return (
      <div className="card pad" style={{ textAlign: 'center' }}>
        <p className="muted">Belum ada entri. Mulai dengan menulis sesuatu.</p>
        <div style={{ height: 8 }} />
        <Link className="button secondary" href="/new">Tulis Entri</Link>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card pad">
        <div className="grid cols-2">
          <input className="input" placeholder="Cari judul/isi" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div style={{ display: 'flex', gap: 12 }}>
            <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">Semua tag</option>
              {tags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button className="button ghost" onClick={() => { setQuery(""); setTag(""); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        {filtered.map(e => (
          <Link key={e.id} href={`/entry/${e.id}`} className="list-item card">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <strong>{e.title || '(Tanpa Judul)'}</strong>
                <span className="muted" style={{ fontSize: 12 }}>Diperbarui {formatDate(e.updatedAt)}</span>
              </div>
              <div className="muted" style={{ marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {e.content || '(tidak ada isi)'}
              </div>
              {e.tags.length > 0 && (
                <div className="tags" style={{ marginTop: 8 }}>
                  {e.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
