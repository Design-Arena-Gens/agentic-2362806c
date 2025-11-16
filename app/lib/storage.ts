export type StorageAPI<T> = {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  save: (items: T[]) => void;
};

const KEY_PREFIX = 'journal.entries.v1';

export function createBrowserStorage<T>(): StorageAPI<T> {
  if (typeof window === 'undefined') {
    // SSR safe no-op storage
    let mem: T[] = [];
    return {
      getAll: () => mem,
      getById: (id: string) => (mem as any[]).find((x) => x.id === id),
      save: (items: T[]) => {
        mem = items;
      },
    };
  }

  return {
    getAll: () => {
      const raw = window.localStorage.getItem(KEY_PREFIX);
      if (!raw) return [];
      try {
        return JSON.parse(raw) as T[];
      } catch {
        return [];
      }
    },
    getById: (id: string) => {
      const items = JSON.parse(window.localStorage.getItem(KEY_PREFIX) || '[]') as any[];
      return items.find((x) => x.id === id);
    },
    save: (items: T[]) => {
      window.localStorage.setItem(KEY_PREFIX, JSON.stringify(items));
    },
  };
}
