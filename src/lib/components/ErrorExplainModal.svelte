<script lang="ts">
  import Markdown from "./Markdown.svelte";
  import { explain } from "$lib/examples/explain";

  export let traceback = "<missing>";
  export let code = "<missing>";

  let output = "";

  async function runExplain(traceback: string, code: string) {
    output = "";
    for await (const delta of explain(traceback, code)) output += delta;
  }

  $: runExplain(traceback, code);
</script>

<div class="max-w-sm w-1/2 xl:max-w-3xl">
  <Markdown text={output} />
</div>
