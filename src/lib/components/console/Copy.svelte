<script lang="ts">
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

    toast.success(`successfully copied ${n} ${n === 1 ? "line" : "lines"} to clipboard`);
  }
</script>

<button aria-label="Copy text" on:click={handleClick} class="i-icon-park-twotone-copy" />
