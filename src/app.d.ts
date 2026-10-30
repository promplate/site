import type { HTMLInputAttributes } from "svelte/elements";

declare module "svelte/elements" {
  interface HTMLTextareaAttributes {
    autocorrect?: HTMLInputAttributes["autocorrect"];
  }
}

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export { };
