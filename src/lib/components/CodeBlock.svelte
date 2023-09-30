<script lang="ts">
  import type { Highlighter } from "shikiji";
  import { getHighlighter } from "shikiji";
  export let code: string;
  export let collapse = false;

  let shiki: Highlighter;

  const loadCode = async () => {
    shiki = shiki ?? (await getHighlighter({ themes: ["vitesse-dark"], langs: ["python"] }));
    return shiki.codeToHtml(code, { lang: "python", theme: "vitesse-dark" });
  };
</script>

<section class:shrink-0={!collapse} class="not-prose overflow-y-scroll b-1 b-white/10 rounded-md bg-#121212">
  {#key code}
    {#await loadCode()}
      <pre class="text-white/70">{code}</pre>
    {:then code}
      {@html code}
    {/await}
  {/key}
</section>

<style>
  :global(pre) {
    --uno: p-5 text-xs sm:text-sm font-mono w-fit;
  }

  :global(pre *) {
    --uno: font-mono selection:bg-white/10;
  }
</style>
