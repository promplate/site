<script lang="ts">
  import type { PyAwaitable, PyProxy, PythonError } from "pyodide/ffi";
  import type { KeyboardEventHandler } from "svelte/elements";

  import ConsolePrompt from "$lib/components/ConsolePrompt.svelte";
  import InlineCode from "$lib/components/InlineCode.svelte";
  import { getPy, initConsole } from "$lib/pyodide";
  import { onMount } from "svelte";

  type Item = { type: "out" | "err" | "in" | "repr"; text: string; incomplete?: boolean };

  type Status = "incomplete" | "syntax-error" | "complete";

  let loading = true;

  let log: Item[] = [];

  const history: string[] = [];
  let index = -1;

  let input = "";
  let inputRef: HTMLInputElement;

  let pyConsole: PyProxy;
  let getWrapped: (future: PyAwaitable) => Promise<[unknown, string]>;
  let complete: (source: string) => [string[], number];

  let status: Status = "complete";

  function pushLog(item: Item) {
    if (!log.length)
      return (log = [item]);

    const last = log.at(-1)!;

    if (last.type === item.type && (item.type === "out" || (item.type === "in" && item.incomplete))) {
      last.text += item.type === "in" ? `\n${item.text}` : item.text;
      log = [...log];
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

    loading = false;

    await push("from promplate import *");
    await push("from promplate.llm.openai import *");
    await push("# now all exposed APIs of promplate are available");
  });

  async function push(source: string) {
    const future: PyAwaitable & { syntax_check: Status; formatted_error: string } = pyConsole.push(source);

    pushLog({ type: "in", text: source, incomplete: status === "incomplete" });

    status = future.syntax_check;
    if (status === "syntax-error") {
      pushLog({ type: "err", text: `Traceback (most recent call last):\n${future.formatted_error}` });
    }
    else if (status === "complete") {
      loading = true;
      try {
        const [result, repr] = await getWrapped(future);
        if (result != null) {
          pushLog({ type: "repr", text: repr });
          pyConsole.globals.set("_", result);
        }
      }
      catch (e) {
        pushLog({ type: "err", text: (e as PythonError).message });
      }
      finally {
        loading = false;
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
      <div class="group flex flex-row">
        <div class="min-h-1.4em flex flex-shrink-0 flex-col gap-0.7">
          <ConsolePrompt />
          {#if text !== "\n"}
            {#each Array.from({ length: text.match(/\n/g)?.length ?? 0 }) as _}
              <ConsolePrompt prompt="..." />
            {/each}
          {/if}
        </div>
        <InlineCode {text}></InlineCode>
      </div>
    {:else if type === "err"}
      <div class="text-red-4">{text}</div>
    {:else if type === "repr"}
      <div class="text-cyan-2">{text}</div>
    {/if}
  {/each}
  <div class="group flex flex-row" class:animate-pulse={loading}>
    <ConsolePrompt prompt={status === "incomplete" ? "..." : ">>>"} />
    <input bind:this={inputRef} class="h-none m-0 w-full rounded bg-transparent p-0 outline-none" bind:value={input} type="text" on:keydown={onKeyDown} />
  </div>
</div>
