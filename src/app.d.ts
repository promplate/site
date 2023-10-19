import type { Highlighter } from "shikiji";

declare global {
  interface Window {
    cache: Record<string, Highlighter>;
  }

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
