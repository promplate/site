<script lang="ts">
  import Markdown from "../Markdown.svelte";
  import { md } from "$lib/markdown";
  import { toast } from "svelte-sonner";

  export let text: string;

  async function handleClick() {
    const source = text.trimEnd();
    try {
      await navigator.clipboard.writeText(source);
    }
    catch {
      toast.error("failed to copy to clipboard");
      return;
    }

    const n = source.split("\n").length;

    const html = await md`successfully copied \`${n}\` ${n === 1 ? "line" : "lines"} to clipboard`;

    toast.success(Markdown, { componentProps: { html } });
  }
</script>

<button aria-label="Copy text" on:click={handleClick} class="i-icon-park-twotone-copy" />
