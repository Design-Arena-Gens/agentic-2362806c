"use client";

import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import EntryForm from "@/app/components/EntryForm";
import type { JournalEntry } from "@/app/types";
import { createBrowserStorage } from "@/app/lib/storage";

const storage = createBrowserStorage<JournalEntry>();

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const e = storage.getById(params.id);
    if (!e) {
      setEntry(null);
      return;
    }
    setEntry(e);
  }, [params.id]);

  const title = useMemo(() => entry?.title ?? '', [entry]);

  function updateEntry(update: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
    if (!entry) return;
    const all = storage.getAll();
    const idx = all.findIndex(e => e.id === entry.id);
    if (idx === -1) return;
    const now = new Date().toISOString();
    const updated: JournalEntry = {
      ...entry,
      title: update.title,
      content: update.content,
      tags: update.tags,
      updatedAt: now,
    };
    all[idx] = updated;
    storage.save(all);
    setEntry(updated);
  }

  function deleteEntry() {
    if (!entry) return;
    const all = storage.getAll();
    const filtered = all.filter(e => e.id !== entry.id);
    storage.save(filtered);
    router.push('/');
  }

  if (entry === null) {
    return (
      <div className="card pad">
        <p>Entri tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <h1 style={{ margin: 0 }}>{title || '(Tanpa Judul)'}</h1>
      <div className="card pad">
        <EntryForm initial={entry} onSubmit={updateEntry} onDelete={deleteEntry} submitLabel="Perbarui" />
      </div>
    </div>
  );
}
