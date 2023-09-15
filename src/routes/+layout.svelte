<script>
  import "@unocss/reset/tailwind-compat.css";
  import "uno.css";
</script>

<slot />

<style>
  :global(html) {
    --uno: bg-neutral-9 text-white;
  }

  :global(*)::selection {
    --uno: bg-white/15;
  }
</style>
