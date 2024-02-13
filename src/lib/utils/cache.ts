export function cacheGlobally<T extends () => unknown>(key: string, target: T): T {
  return (() => {
    if (typeof window !== "undefined") {
      const cache = window.cache = window.cache ?? new Map();

      if (cache.has(key)) return cache.get(key);

      const result = target();
      cache.set(key, result);
      return result;
    }

    return target();
  }) as T
}