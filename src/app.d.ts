import type { Highlighter } from "shikiji";

declare global {
  interface Window {
    shiki: Highlighter;
  }

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
