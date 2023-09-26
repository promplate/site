<script>
  import { dev } from "$app/environment";
  import { PUBLIC_HEAD_SCRIPTS as headScripts } from "$env/static/public";
  import "@unocss/reset/tailwind-compat.css";
  import "uno.css";
</script>

<svelte:head>
  {#if headScripts && !dev}
    {@html headScripts}
  {/if}
</svelte:head>

<slot />

<style>
  :global(html) {
    --uno: bg-neutral-9 text-white;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }
</style>
