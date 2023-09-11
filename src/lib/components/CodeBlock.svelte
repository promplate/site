<script lang="ts">
  import type { Highlighter } from "shikiji";
  import { getHighlighter } from "shikiji";
  export let code: string;

  let shiki: Highlighter;

  const loadCode = async () => {
    shiki = shiki ?? (await getHighlighter({ themes: ["vitesse-dark"], langs: ["python"] }));
    return shiki.codeToHtml(code, { lang: "python", theme: "vitesse-dark" });
  };
</script>

<div class="relative overflow-hidden b-1 b-white/10 rounded-md bg-#121212">
  <section class="max-h-85vh overflow-scroll">
    {#key code}
      {#await loadCode()}
        <pre class="text-white/70">{code}</pre>
      {:then code}
        {@html code}
      {/await}
    {/key}
  </section>
</div>

<style>
  section::-webkit-scrollbar {
    --uno: hidden;
  }

  :global(pre) {
    --uno: p-5 text-sm font-mono;
  }

  :global(pre *) {
    --uno: font-mono;
  }
</style>
