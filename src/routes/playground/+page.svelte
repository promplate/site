<script lang="ts">
  import type { ActionData } from "./$types";
  import type { Source } from "$lib/utils/source";
  import type { PyAwaitable, PyProxy, PythonError } from "pyodide/ffi";
  import type { KeyboardEventHandler } from "svelte/elements";

  import { page } from "$app/stores";
  import ConsolePrompt from "$lib/components/ConsolePrompt.svelte";
  import InlineCode from "$lib/components/InlineCode.svelte";
  import { getPy, initConsole } from "$lib/pyodide";
  import { patchSource } from "$lib/pyodide/translate";
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
      const index = log.findIndex(item => item === behind);
      log = [...log.slice(0, index), behind, item, ...log.slice(index + 1)];
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

    if (sources?.length) {
      for (const { source, hidden, wait } of sources)
        await pushMany(patchSource(source).split("\n"), Boolean(wait), hidden);
    }
    else {
      await pushMany([
        "from promplate import *",
        "from promplate.llm.openai import *",
        "# now all exposed APIs of promplate are available",
      ], true);
    }
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
      catch (e) {
        pushLog({ type: "err", text: (e as PythonError).message }, inputLog);
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

<div class="my-8 w-[calc(100vw-4rem)] flex flex-col gap-0.7 overflow-x-scroll whitespace-pre-wrap rounded bg-white/3 p-5 text-neutral-3 font-mono <lg:(my-6 w-[calc(100vw-3rem)] p-4 text-sm) <sm:(my-4 w-[calc(100vw-2rem)] p-3 text-xs) [&>div:hover]:(rounded-sm bg-white/2 px-1.7 py-0.6 -mx-1.7 -my-0.6)">
  {#each log as { type, text }}
    {#if type === "out"}
      <div class="text-yellow-2">{text}</div>
    {:else if type === "in"}
      {#if text !== ""}
        <div class="group flex flex-row [&_.line]:(min-h-4 lg:min-h-6 sm:min-h-5)">
          <div class="min-h-1 flex flex-shrink-0 flex-col gap-0.7 lg:min-h-1.4 sm:min-h-1.2">
            <ConsolePrompt />
            {#each Array.from({ length: text.match(/\n/g)?.length ?? 0 }) as _}
              <ConsolePrompt prompt="..." />
            {/each}
          </div>
          <InlineCode {text}></InlineCode>
        </div>
      {:else}
        <section class="animate-(fade-out duration-300 both)">
          <ConsolePrompt />
        </section>
      {/if}
    {:else if type === "err"}
      <div class="text-red-4">{text}</div>
    {:else if type === "repr"}
      <div class="text-cyan-2">{text}</div>
    {/if}
  {/each}
  <div class="group flex flex-row" class:animate-pulse={loading}>
    <ConsolePrompt prompt={status === "incomplete" ? "..." : ">>>"} />
    <!-- svelte-ignore a11y-autofocus -->
    <input autofocus bind:this={inputRef} class="w-full bg-transparent outline-none" bind:value={input} type="text" on:keydown={onKeyDown} />
  </div>
</div>
