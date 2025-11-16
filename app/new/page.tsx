"use client";

import { useRouter } from 'next/navigation';
import EntryForm from "@/app/components/EntryForm";
import type { JournalEntry } from "@/app/types";
import { createBrowserStorage } from "@/app/lib/storage";

const storage = createBrowserStorage<JournalEntry>();

export default function NewEntryPage() {
  const router = useRouter();

  function handleCreate(e: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : String(Date.now());
    const now = new Date().toISOString();
    const entry: JournalEntry = { id, createdAt: now, updatedAt: now, ...e };
    const all = storage.getAll();
    all.push(entry);
    storage.save(all);
    router.push(`/entry/${id}`);
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <h1 style={{ margin: 0 }}>Entri Baru</h1>
      <div className="card pad">
        <EntryForm onSubmit={handleCreate} submitLabel="Simpan" />
      </div>
    </div>
  );
}
