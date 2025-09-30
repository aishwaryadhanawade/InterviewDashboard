export const storage = {
  getJSON<T>(key: string): T | null {
    try {
      if (typeof window === "undefined") return null;
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  setJSON<T>(key: string, value: T): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // optional: log or ignore
    }
  },

  remove(key: string): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch {
      // optional: log or ignore
    }
  },
};