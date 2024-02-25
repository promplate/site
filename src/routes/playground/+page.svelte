<script lang="ts">
  import type { ActionData } from "./$types";
  import type { Source } from "$lib/utils/source";
  import type { PyAwaitable, PyProxy } from "pyodide/ffi";
  import type { KeyboardEventHandler } from "svelte/elements";

  import { page } from "$app/stores";
  import { Err, In, Out, Repr } from "$lib/components/console";
  import ConsolePrompt from "$lib/components/ConsolePrompt.svelte";
  import { getPy, initConsole } from "$lib/pyodide";
  import { patchSource, reformatInputSource } from "$lib/pyodide/translate";
  import { onMount } from "svelte";

  export let form: ActionData;

  const { sources } = (form ?? $page.state) as { sources?: Source[] };

  type Item = { type: "out" | "err" | "in" | "repr"; text: string; incomplete?: boolean };

  type Status = "incomplete" | "syntax-error" | "complete";

  let loading = 1;

  let log: Item[] = [];

  const history: string[] = [];
  let index = -1;

  let input = "";
  let inputRef: HTMLInputElement;

  let pyConsole: PyProxy;
  let getWrapped: (future: PyAwaitable) => Promise<[unknown, string]>;
  let complete: (source: string) => [string[], number];

  let status: Status = "complete";

  let focusedError: { traceback: string; code: string };

  function showErrorExplain(index: number) {
    if (log[index]?.type !== "err")
      return;

    const traceback = log[index].text;

    const code = log.slice(0, index).map(({ text, type }) => type === "in" ? reformatInputSource(text) : text).join("\n");

    focusedError = { traceback, code };
  }

  function pushLog(item: Item, behind?: Item) {
    if (!log.length)
      return void (log = [item]);

    const last = log.at(-1)!;

    if (last.type === item.type && (item.type === "out" || (item.type === "in" && item.incomplete))) {
      last.text += item.type === "in" ? `\n${item.text}` : item.text;
      log = [...log];
      return last;
    }
    else if (behind) {
      let index = log.findIndex(item => item === behind);
      if (log[index + 1]?.type === "out")
        index++;
      log = [...log.slice(0, index + 1), item, ...log.slice(index + 1)];
    }
    else {
      log = [...log, item];
    }
  }

  onMount(async () => {
    history.unshift(...(JSON.parse(localStorage.getItem("console-history") || "[]") as string[]).slice(0, 200));
    inputRef.focus();

    const py = await getPy();
    await initConsole();
    pyConsole = py.globals.get("console");
    getWrapped = py.globals.get("get_wrapped");
    complete = py.globals.get("complete");

    pyConsole.stdout_callback = (text: string) => pushLog({ type: "out", text });
    pyConsole.stderr_callback = (text: string) => pushLog({ type: "err", text });

    loading--;

    async function pushMany(lines: string[], wait: boolean, hidden?: boolean) {
      for (const line of lines) {
        const promise = hidden ? pyConsole.push(line) : push(line);
        wait && (await promise);
      }
    }

    if (sources?.length)
      for (const { source, hidden, wait } of sources) await pushMany(patchSource(source).split("\n"), Boolean(wait), hidden);
    else await pushMany(["from promplate import *", "from promplate.llm.openai import *", "# now all exposed APIs of promplate are available"], true);
  });

  async function push(source: string) {
    const future: PyAwaitable & { syntax_check: Status; formatted_error: string } = pyConsole.push(source);

    let inputLog: Item = { type: "in", text: source, incomplete: status === "incomplete" };
    inputLog = pushLog(inputLog) ?? inputLog;

    status = future.syntax_check;
    if (status === "syntax-error") {
      pushLog({ type: "err", text: `Traceback (most recent call last):\n${future.formatted_error}` }, inputLog);
    }
    else if (status === "complete") {
      loading++;
      try {
        const [result, repr] = await getWrapped(future);
        if (result != null) {
          pushLog({ type: "repr", text: repr }, inputLog);
          pyConsole.globals.set("_", result);
        }
      }
      catch (_) {
        pushLog({ type: "err", text: future.formatted_error }, inputLog);
      }
      finally {
        loading--;
      }
    }
  }

  function handleInput() {
    push(input);
    if (input.trim() && input !== history[0]) {
      history.unshift(input);
      localStorage.setItem("console-history", JSON.stringify(history));
    }
    input = "";
  }

  function setCusorToEnd() {
    requestAnimationFrame(() => inputRef.setSelectionRange(input.length, input.length));
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case "ArrowUp": {
        const text = history.at(++index);
        if (text) {
          input = text;
          setCusorToEnd();
        }
        else {
          index = history.length;
        }
        break;
      }

      case "ArrowDown": {
        index--;
        if (index <= -1) {
          input = "";
          index = -1;
          break;
        }
        input = history.at(index)!;
        setCusorToEnd();
        break;
      }

      case "Tab": {
        event.preventDefault();
        if (!input.trim()) {
          input += " ".repeat(4);
        }
        else {
          const [results, position] = complete(input);
          if (results.length === 1) {
            input = input.slice(0, position) + results[0];
            setCusorToEnd();
          }
        }
        index = -1;
        break;
      }

      case "Enter": {
        handleInput();
        index = -1;
        break;
      }

      default: {
        index = -1;
      }
    }
  };
</script>

<div class="my-4 w-[calc(100vw-2rem)] flex flex-row gap-4 p-3 text-neutral-3 <lg:(my-3 w-[calc(100vw-1.5rem)] gap-3 p-2 text-sm) <sm:(my-2 w-[calc(100vw-1rem)] gap-2 p-1 text-xs) [&>div]:(overflow-x-scroll rounded bg-white/3 p-5 <lg:p-4 <sm:p-3)">
  <div class="w-full flex flex-col gap-0.7 whitespace-pre-wrap font-mono [&>div:hover]:(rounded-sm bg-white/2 px-1.7 py-0.6 -mx-1.7 -my-0.6)">
    {#each log as { type, text }, index}
      {#if type === "out"}
        <Out {text} />
      {:else if type === "in"}
        <In {text} on:click={() => push(text)} />
      {:else if type === "err"}
        <Err {text} on:click={() => showErrorExplain(index)} />
      {:else if type === "repr"}
        <Repr {text} />
      {/if}
    {/each}
    <div class="group flex flex-row" class:animate-pulse={loading}>
      <ConsolePrompt prompt={status === "incomplete" ? "..." : ">>>"} />
      <!-- svelte-ignore a11y-autofocus -->
      <input autofocus bind:this={inputRef} class="w-full bg-transparent outline-none" bind:value={input} type="text" on:keydown={onKeyDown} />
    </div>
  </div>
  {#if focusedError}
    {#await import("$lib/components/ErrorExplainModal.svelte") then { default: ErrorExplainModal }}
      {@const { traceback, code } = focusedError}
      <svelte:component this={ErrorExplainModal} {traceback} {code} />
    {/await}
  {/if}
</div>
