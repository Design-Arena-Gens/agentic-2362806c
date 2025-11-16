"use client";

import { useEffect, useMemo, useState } from 'react';
import type { JournalEntry } from "@/app/types";

export type EntryFormProps = {
  initial?: Partial<JournalEntry>;
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDelete?: () => void;
  submitLabel?: string;
};

export default function EntryForm({ initial, onSubmit, onDelete, submitLabel }: EntryFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '));

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setContent(initial?.content ?? "");
    setTagsInput((initial?.tags ?? []).join(', '));
  }, [initial?.title, initial?.content, initial?.tags]);

  const canSubmit = useMemo(() => title.trim().length > 0 || content.trim().length > 0, [title, content]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({ title: title.trim(), content: content.trim(), tags, id: (initial as any)?.id });
  }

  return (
    <form className="grid" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Tulis isi jurnal di sini..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="input"
        placeholder="Tag (pisahkan dengan koma, mis. pribadi, kerja)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" className="button" disabled={!canSubmit}>{submitLabel ?? 'Simpan'}</button>
        {onDelete && (
          <button type="button" className="button danger" onClick={onDelete}>Hapus</button>
        )}
      </div>
    </form>
  );
}
