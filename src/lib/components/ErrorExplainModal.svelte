<script lang="ts">
  import Markdown from "./Markdown.svelte";
  import { explain } from "$lib/examples/explain";
  import { renderMarkdown } from "$lib/markdown";

  export let traceback = "<missing>";
  export let code = "<missing>";

  let html = "";

  async function runExplain(traceback: string, code: string) {
    let output = "";
    for await (const delta of explain(traceback, code)) {
      output += delta;
      html = await renderMarkdown(output, ["python"]);
    }
  }

  $: runExplain(traceback, code);
</script>

<div class="max-w-sm w-1/2 xl:max-w-3xl [&>article]:(<sm:text-xs lg:text-base)">
  <Markdown {html} />
</div>
