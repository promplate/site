<script lang="ts">
  import { highlight } from "../highlight";
  import Form from "./Portal.svelte";

  export let code: string;
  export let collapse = false;
  export let portal = false;
  export let lang = "python";

  code = code.replaceAll("\r", "");
</script>

<section class:shrink-0={!collapse} class="not-prose relative overflow-y-scroll b-1 b-white/10 rounded-md bg-#121212">
  {#key code}
    {#await highlight(lang, code)}
      <pre class="text-white/70">{code}</pre>
    {:then code}
      {@html code}
    {/await}
  {/key}
  {#if portal}
    <Form source={code} />
  {/if}
</section>

<style>
  section :global(pre) {
    --uno: p-5 text-xs sm:text-sm font-mono w-fit;
  }

  section :global(pre *) {
    --uno: font-mono selection:bg-white/10 line-height-relaxed;
  }
</style>
