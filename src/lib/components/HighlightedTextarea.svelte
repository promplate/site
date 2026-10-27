<script lang="ts">
  import { highlight } from "$lib/highlight";

  export let value = "";
  export let lang = "json";
  export let ariaLabel = "Code editor";

  let highlighted = "<pre><code>\n</code></pre>";
  let taskId = 0;

  const renderSource = (source: string) => `${source}\n`;

  $: if (value.includes("\r"))
    value = value.replace(/\r/g, "");
  $: {
    const currentTaskId = ++taskId;
    const source = value;
    void highlight(lang, renderSource(source)).then((html) => {
      if (currentTaskId === taskId)
        highlighted = html;
    });
  }
</script>

<div class="h-full min-w-0 w-full overflow-auto b-1 b-white/10 rounded-md bg-#121212 p-5">
  <div class="relative h-full min-h-fit min-w-full w-max text-xs leading-[1.6] font-mono sm:text-sm">
    <section aria-hidden="true" class="ptr-events-none">
      {@html highlighted}
    </section>
    <textarea bind:value aria-label={ariaLabel} class="absolute inset-0 m-0 h-full w-full resize-none overflow-hidden whitespace-pre border-0 bg-transparent p-0 text-transparent caret-white/90 outline-none selection:bg-white/14" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" wrap="off" />
  </div>
</div>

<style>
  section :global(pre) {
    --uno: m-0 bg-transparent p-0 w-max;
  }
  section :global(pre *) {
    --uno: font-mono;
  }
  section :global(code) {
    --uno: block whitespace-normal;
  }
  section :global(.line) {
    --uno: block whitespace-pre;
  }
  section :global(.line:empty::before) {
    content: " ";
  }
</style>
