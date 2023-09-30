<script>
  import { dev } from "$app/environment";
  import { PUBLIC_HEAD_SCRIPTS } from "$env/static/public";
  import "@unocss/reset/tailwind-compat.css";
  import { page } from "$app/stores";
  import "uno.css";

  const headScripts = atob(PUBLIC_HEAD_SCRIPTS ?? "");

  const ogTitle = "Promplate Docs";
  const ogImage = $page.url.origin + "/og" + $page.url.pathname;
  const ogDescription = "Documentation site for Promplate the prompting framework";
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
    --uno: bg-neutral-9 text-white flex flex-col items-center;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }
</style>
