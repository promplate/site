<script lang="ts">
  import { getHighlighter } from "shikiji";
  export let code: string;
  export let collapse = false;
  export let lang = "python";

  const cachedGetHighlighter = async () => {
    window.cache = window.cache ?? {};
    window.cache[lang] = window.cache[lang] ?? (await getHighlighter({ themes: ["vitesse-dark"], langs: [lang] }));
    return window.cache[lang];
  };

  const loadCode = async () => {
    return (await cachedGetHighlighter()).codeToHtml(code, { lang, theme: "vitesse-dark" });
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
