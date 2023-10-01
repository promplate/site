<script>
  import { dev } from "$app/environment";
  import { PUBLIC_HEAD_SCRIPTS } from "$env/static/public";
  import "@unocss/reset/tailwind-compat.css";
  import { page } from "$app/stores";
  import "uno.css";

  const headScripts = atob(PUBLIC_HEAD_SCRIPTS ?? "");

  const ogTitle = "Promplate 中文文档";
  const ogImage = $page.url.origin + "/og" + $page.url.pathname;
  const ogDescription = "提示工程框架 Promplate 的官方中文文档";
</script>

<svelte:head>
  {#if headScripts && !dev}
    {@html headScripts}
  {/if}

  <title>{ogTitle}</title>
  <meta property="og:title" content={ogTitle} />
  <meta property="twitter:title" content={ogTitle} />

  <meta property="twitter:card" content="summary_large_image" />

  <meta property="og:image" content={ogImage} />
  <meta property="twitter:image" content={ogImage} />

  <meta property="description" content={ogDescription} />
  <meta property="og:description" content={ogDescription} />
  <meta property="twitter:description" content={ogDescription} />
</svelte:head>

<slot />

<style>
  :global(html) {
    --uno: bg-neutral-9 text-white flex flex-col items-center overflow-x-hidden;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }

  :global(body)::-webkit-scrollbar {
    --uno: bg-neutral-9 w-1 sm:w-1.5 md:w-2 lg:w-2.5 xl:w-3 2xl:w-3.5;
  }

  :global(body)::-webkit-scrollbar-thumb {
    --uno: bg-neutral-7/30 hover:bg-neutral-7/70 rounded-l-sm;
  }

  :global(body *)::-webkit-scrollbar {
    --uno: hidden;
  }
</style>
