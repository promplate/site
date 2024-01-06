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

<article class="m-10 max-w-3xl w-[calc(100vw-5rem)] flex flex-col gap-5 md:(m-20 w-[calc(100vw-10rem)]) 2xl:max-w-5xl xl:max-w-4xl">
  <hgroup class="flex flex-col gap-5 tracking-wide">
    <h1 class="text-4xl font-light">{meta.title}</h1>
    <p class="rounded-md bg-white/5 px-3 py-2 font-serif">{meta.description}</p>
  </hgroup>
  <main class="max-w-full prose [&>details_pre]:m-0 [&>details_*]:my-3 [&>pre]:(b-1 b-white/10 bg-#121212) [&_blockquote]:(b-l-4 b-white/50 p-0 not-oblique) [&>details]:(p-0 text-white/80) [&_pre>code]:text-white/80 [&_strong,&_a,&_code,&_summary]:(text-white font-normal) [&>p]:text-white/80 [&_[id]>a]:no-underline">
    <svelte:component this={data.content} />
  </main>
</article>
