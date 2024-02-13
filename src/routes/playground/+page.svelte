<script lang="ts">
  import ConsolePrompt from "$lib/components/ConsolePrompt.svelte";
  import { getPy, initConsole } from "$lib/pyodide";
  import type { PyAwaitable, PyProxy, PythonError } from "pyodide/ffi";
  import { onMount } from "svelte";
  import type { KeyboardEventHandler } from "svelte/elements";

  type Item = { type: "out" | "err" | "in" | "repr"; text: string; incomplete?: boolean };

  type Status = "incomplete" | "syntax-error" | "complete";

  let loading = true;

  let log: Item[] = [];

  let history: string[] = [];
  let index = -1;

  function joinLog(log: Item[]) {
    let res: Item[] = [];
    log.forEach(({ type, text, incomplete }) => {
      const last = res.at(-1);

      if (last && last.type === type && last.text.at(-1) === "\n" && last.text.at(-2) !== "\n" && text === "\n") {
        last.text += text;
        res = [...res.slice(0, -1), last];
      } else if (text) {
        res.push({ type, text, incomplete });
      }
    });
    return res;
  }

  let input = "";
  let inputRef: HTMLInputElement;

  let pyConsole: PyProxy;
  let getWrapped: (future: PyAwaitable) => Promise<[unknown, string]>;
  let complete: (source: string) => [string[], number];

  let status: Status = "complete";

  onMount(async () => {
    history.unshift(...JSON.parse(localStorage.getItem("console-history") || "[]"));
    inputRef.focus();

    const py = await getPy();
    await initConsole();
    pyConsole = py.globals.get("console");
    getWrapped = py.globals.get("get_wrapped");
    complete = py.globals.get("complete");

    pyConsole.stdout_callback = (str: string) => {
      log = [...log, { type: "out", text: str.trim() ? str.trimEnd() : "" }];
    };

    pyConsole.stderr_callback = (str: string) => {
      log = [...log, { type: "err", text: str.trim() ? str.trimEnd() : "" }];
    };

    loading = false;
  });

  async function afterPush(future: PyAwaitable & { syntax_check: Status; formatted_error: string }) {
    status = future.syntax_check;
    if (status === "syntax-error") {
      console.log(future.formatted_error);
      log = [...log, { type: "err", text: `Traceback (most recent call last):\n${future.formatted_error}` }];
    } else if (status === "complete") {
      loading = true;
      try {
        const [result, repr] = await getWrapped(future);
        log = [...log, { type: "repr", text: repr ?? "" }];
        pyConsole.globals.set("_", result);
      } catch (e) {
        log = [...log, { type: "err", text: (e as PythonError).message }];
      } finally {
        loading = false;
      }
    }
  }

  function handleInput() {
    const future = pyConsole.push(input);
    if (input.trim() && input !== history[0]) {
      history.unshift(input);
      localStorage.setItem("console-history", JSON.stringify(history));
    }
    log = [...log, { type: "in", text: `${input}`, incomplete: status === "incomplete" }];
    afterPush(future);
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
        } else {
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
        } else {
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

<div class="my-8 w-[calc(100vw-4rem)] flex flex-col gap-0.5 overflow-x-scroll whitespace-pre-wrap rounded bg-white/5 p-5 font-mono <lg:(my-6 w-[calc(100vw-3rem)] p-4 text-sm) <sm:(my-4 w-[calc(100vw-2rem)] p-3 text-xs) [&>div:hover]:(rounded bg-white/5 px-1 py-0.5 -mx-1 -my-0.5)">
  {#each joinLog(log) as { type, text, incomplete }}
    {#if type === "out"}
      <div class="text-yellow-2">{text}</div>
    {:else if type === "in"}
      <div><ConsolePrompt prompt={incomplete ? "..." : ">>>"} />{text}</div>
    {:else if type === "err"}
      <div class="text-red-4">{text}</div>
    {:else if type === "repr"}
      <div class="text-cyan-2">{text}</div>
    {/if}
  {/each}
  <div class="flex flex-row items-center" class:animate-pulse={loading}>
    <ConsolePrompt prompt={status === "incomplete" ? "..." : ">>>"} />
    <input bind:this={inputRef} class="w-full rounded bg-transparent outline-none" bind:value={input} type="text" on:keydown={onKeyDown} />
  </div>
</div>
