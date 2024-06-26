<script context="module" lang="ts">
  import type { PyAwaitable, PyProxy, PythonError } from "pyodide/ffi";

  export interface Item {
    type: "out" | "err" | "in" | "repr";
    text: string;
    incomplete?: boolean;
  }

  export type AutoComplete = (source: string) => [string[], number];
  export type Status = "incomplete" | "syntax-error" | "complete";
</script>

<script lang="ts">
  import { getPy, initConsole } from "$lib/pyodide";
  import { afterUpdate, beforeUpdate, onMount } from "svelte";

  export let ready = false;
  export let status: Status = "complete";
  export let log: Item[] = [];
  export let pyConsole: PyProxy;
  export let complete: AutoComplete;
  export let autoScroll: false | "instant" | "smooth" = "smooth";

  let loading = 0;

  let getWrapped: (future: PyAwaitable) => Promise<[unknown, string]>;

  onMount(async () => {
    const py = await getPy();
    await initConsole();
    pyConsole = py.globals.get("console");
    complete = py.globals.get("complete");
    getWrapped = py.globals.get("get_wrapped");

    pyConsole.stdout_callback = (text: string) => pushLog({ type: "out", text });
    pyConsole.stderr_callback = (text: string) => pushLog({ type: "err", text });

    ready = true;
  });

  export function pushLog(item: Item, behind?: Item) {
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

  export async function push(source: string) {
    const future: PyAwaitable & { syntax_check: Status; formatted_error: string } = pyConsole.push(source);

    let inputLog: Item = { type: "in", text: source, incomplete: status === "incomplete" };
    inputLog = pushLog(inputLog) ?? inputLog;

    status = future.syntax_check;
    if (status === "syntax-error") {
      pushLog({ type: "err", text: `Traceback (most recent call last):\n${future.formatted_error}` }, inputLog);
      future.exception(); // to prevent an annoying warning
      future.destroy();
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
        pushLog({ type: "err", text: future.formatted_error ?? (e as PythonError).message }, inputLog);
      }
      finally {
        loading--;
        future.destroy();
      }
    }
  }

  let needScroll = false;

  beforeUpdate(() => {
    if (!autoScroll)
      return;

    const el = document.documentElement;
    const offsetBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    needScroll = offsetBottom < 200;
  });

  afterUpdate(() => {
    if (autoScroll && needScroll) {
      const el = document.documentElement;
      el.scrollTo({ top: el.scrollHeight, behavior: autoScroll });
    }
  });
</script>

<slot {status} {loading} />
