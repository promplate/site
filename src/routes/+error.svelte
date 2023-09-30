<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="grid h-95vh place-items-center">
  <div class="flex flex-col gap-6">
    <h1 class="text-5xl font-light tracking-widest">{$page.status}</h1>
    <h2 class="min-w-sm whitespace-pre rounded bg-white/5 p-2 font-mono -mx-1">{$page.error?.message}</h2>
  </div>
</div>
