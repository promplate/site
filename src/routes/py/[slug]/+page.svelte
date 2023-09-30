<script lang="ts">
  import type { Post } from "$lib/types";

  export let data;

  const meta: Post = data.meta;
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="my-20 flex flex-col gap-5">
  <hgroup class="flex flex-col gap-5 tracking-wide">
    <h1 class="text-4xl font-light">{meta.title}</h1>
    <p class="rounded-md bg-white/5 px-3 py-2 font-serif">{meta.description}</p>
  </hgroup>
  <main class="prose [&>pre]:(b-1 b-white/10 bg-#121212)">
    <svelte:component this={data.content} />
  </main>
</article>
