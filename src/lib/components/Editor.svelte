<script lang="ts">
  import type monaco from "monaco-editor-core";

  import { shikiToMonaco } from "@shikijs/monaco";
  import { getHighlighter } from "$lib/highlight";
  import { getAbortSignal } from "svelte";

  let editor: monaco.editor.IStandaloneCodeEditor | undefined;

  export let source: string;
  export let showLineNum = false;
  export let wrap = false;

  export let lang = "python";

  async function initializeEditor(container: HTMLDivElement, signal: AbortSignal) {
    const monaco = await import("monaco-editor-core");
    const highlighter = await getHighlighter(lang);
    if (signal.aborted)
      return;
    monaco.languages.register({ id: lang });
    shikiToMonaco(highlighter, monaco);

    const instance = monaco.editor.create(container, {
      value: source.replaceAll("\r\n", "\n"),
      language: lang,
      theme: "vitesse-dark",
      fontFamily: "fira code",
      smoothScrolling: true,
      lineHeight: 1.6,
      minimap: { enabled: false },
      fontLigatures: true,
      lineNumbers: showLineNum ? "interval" : "off",
      roundedSelection: false,
      cursorBlinking: "phase",
      wordWrap: wrap ? "on" : "off",
      cursorSmoothCaretAnimation: "explicit",
      renderLineHighlight: "all",
      renderLineHighlightOnlyWhenFocus: true,
      padding: { top: 24 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });

    editor = instance;
    instance.onDidChangeModelContent(() => source = instance.getValue({ lineEnding: "\n", preserveBOM: false }));
  }

  function attachEditor(container: HTMLDivElement) {
    initializeEditor(container, getAbortSignal());
    return () => editor?.dispose();
  }
</script>

<div {@attach attachEditor} class="overflow-hidden b-1 b-white/10 rounded-md" />
