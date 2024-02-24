<script lang="ts">
  import rehypeShiki from "@shikijs/rehype";
  import rehypeStringify from "rehype-stringify";
  import remarkParse from "remark-parse";
  import remarkRehype from "remark-rehype";
  import { onMount } from "svelte";
  import { unified } from "unified";

  export let text = "";

  let output = "";

  const processer = unified().use(remarkParse).use(remarkRehype).use(rehypeShiki, { theme: "vitesse-dark" }).use(rehypeStringify);

  async function reRender() {
    const { value } = await processer.process(text);

    output = value as string;
  }

  $: text && reRender();

  onMount(reRender);
</script>

<article class="min-w-full text-base text-xs prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 md:text-sm xl:text-base">
  {@html output}
</article>

<style>
  article :global(:where(h1, h2, h3, h4, h5, h6)) {
    --uno: font-bold \!text-base text-white m-0;
  }

  article :global(strong) {
    --uno: text-white font-bold;
  }

  article :global(pre) {
    --uno: leading-relaxed py-4 px-3;
  }

  article :global(pre code) {
    --uno: whitespace-pre bg-transparent;
  }

  article :global(code) {
    --uno: inline-block py-0.2 -my-0.2 mx-0.2 -translate-y-0.1em font-normal px-1 text-0.8em rounded bg-white/8 text-white before:content-none after:content-none whitespace-normal;
  }
</style>
