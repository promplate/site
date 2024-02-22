export interface SourceRef { id: string; hidden?: boolean; wait?: boolean };

export interface Source { source: string; hidden?: boolean; wait?: boolean };

export function saveSource(key: string, source: string) {
  window.cache.set(key, source);
}

export function loadSource(key: string): string {
  return window.cache.get(key) as string;
}
