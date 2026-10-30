<script context="module" lang="ts">
  let pendingRun = Promise.resolve();
</script>

<script lang="ts">
  import type { PageData } from "./$types";
  import type { PyodideInterface } from "pyodide";
  import type { PythonError } from "pyodide/ffi";

  import makeContext from "$lib/../templates";
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import Editor from "$lib/components/Editor.svelte";
  import _script from "$lib/examples/template.py?raw";
  import { getPy } from "$lib/pyodide";
  import { onDestroy, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { scale } from "svelte/transition";

  export let data: PageData;

  let { prompt } = data;
  let script = _script.replaceAll("# type: ignore", "").trimStart();
  let output = "";

  let loading = false;
  let py: PyodideInterface;
  let disposed = false;

  onDestroy(() => disposed = true);

  onMount(async () => {
    const runtime = await getPy();
    if (disposed)
      return;
    py = runtime;
    prompt && (await reRun());
  });

  async function reRun() {
    if (loading || disposed)
      return;
    output = "";
    loading = true;
    const template = prompt;
    const source = script;
    // Route instances share Pyodide globals and stdout.
    const run = pendingRun.then(async () => {
      if (disposed)
        return;
      const context = await makeContext();
      if (disposed)
        return;
      py.globals.set("prompt", template);
      py.globals.set("context", py.toPy(context));
      const decoder = new TextDecoder();
      py.setStdout({
        write(buffer) {
          if (!disposed)
            output += decoder.decode(buffer);
          return buffer.length;
        },
      });
      try {
        await py.runPythonAsync(source);
      }
      finally {
        py.setStdout();
      }
    });
    pendingRun = run.catch(() => {});
    try {
      await run;
    }
    catch (e) {
      if (!disposed)
        toast.error((e as PythonError).message);
    }
    finally {
      loading = false;
    }
  }
</script>

<div class="mx-20 mt-20 max-w-100rem w-[calc(100vw-10rem)] flex flex-row gap-7">
  <div class="relative h-[calc(100vh-10rem)] w-1/2 flex flex-col [&>*]:h-full">
    <Editor bind:source={prompt} lang="jinja" wrap showLineNum />
    <button aria-label="Run prompt" class="absolute bottom-5 right-5 w-10 overflow-hidden rounded-md bg-white/10 text-lg transition [&>div]:(absolute left-1/2 top-1/2 -translate-1/2) !h-10 active:bg-white/50 disabled:(bg-white text-neutral-8) hover:bg-white/15" on:click|trusted={reRun} disabled={loading || !py}>
      {#if loading}
        <div transition:scale={{ start: 5 }} class="i-svg-spinners-90-ring-with-bg" />
      {:else}
        <div transition:scale class="i-octicon-feed-rocket-16" />
      {/if}
    </button>
  </div>
  <div class="h-[calc(100vh-10rem)] w-1/2 flex flex-col gap-7 [&>div]:h-1/2 [&>section]:h-full [&>section>*]:!whitespace-pre-wrap">
    <Editor bind:source={script} />
    <CodeBlock code={output} collapse lang="markdown" />
  </div>
</div>
