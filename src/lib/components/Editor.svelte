<script lang="ts">
  import { shikiToMonaco } from "@shikijs/monaco";
  import { getHighlighter } from "$lib/highlight";
  import { onMount } from "svelte";

  let container: HTMLDivElement;

  export let source: string;
  export let showLineNum = false;
  export let wrap = false;

  export let lang = "python";

  onMount(async () => {
    const monaco = await import("monaco-editor-core");
    const highlighter = await getHighlighter(lang);
    monaco.languages.register({ id: lang });
    shikiToMonaco(highlighter, monaco);

    const editor = monaco.editor.create(container, {
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

    editor.onDidChangeModelContent(() => source = editor.getValue({ lineEnding: "\n", preserveBOM: false }));
  });
</script>

<div bind:this={container} class="overflow-hidden b-1 b-white/10 rounded-md" />
