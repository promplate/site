<script>
  import "@unocss/reset/tailwind-compat.css";
  import "uno.css";

  import { dev } from "$app/env";
  import * as env from "$app/env/public";
  import { page } from "$app/state";
  import { Toaster } from "svelte-sonner";

  const headScripts = atob(env.PUBLIC_HEAD_SCRIPTS ?? "");

  const { children } = $props();
  const ogTitle = $derived(page.data.meta?.title ?? "Promplate Docs");
  const ogImage = $derived(`${page.url.origin}/og${page.url.pathname}`);
  const ogDescription = $derived(page.data.meta?.description ?? "Documentation site for Promplate the prompting framework");
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

  <meta name="description" content={ogDescription} />
  <meta property="og:description" content={ogDescription} />
  <meta property="twitter:description" content={ogDescription} />
</svelte:head>

<Toaster theme="dark" />

{@render children()}

<style>
  :global(html) {
    --uno: bg-neutral-9 text-white flex flex-col items-center overflow-x-hidden;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }

  :global(body) {
    --uno: min-h-screen;
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
