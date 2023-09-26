<script lang="ts">
  import { page } from "$app/stores";
  const base = $page.url.href + "/";
  let path = "<path>";
  let inputRef: HTMLInputElement;
</script>

<div class="fixed left-1/2 top-1/2 max-h-4/5 max-w-4/5 flex flex-col items-center gap-5vh -translate-1/2">
  <img class="max-h-4/5 max-w-4/5 rounded-5" src={base + (path || "<path>")} alt="og" />
  <div class="w-4/5 flex flex-row rounded-full p-2 pl-3.5 tracking-wider ring-0.7 ring-white/20 ring-inset transition-shadow focus-within:ring-1.5 focus-within:ring-white/50">
    <span class="select-none op-40" role="none" on:click={() => inputRef.focus()}>{base}</span>
    <input bind:this={inputRef} class="min-w-0 flex-grow-1 bg-transparent outline-none" type="text" autocomplete="off" bind:value={path} />
    <a href={base + path} class="grid place-items-center rounded-full bg-neutral-3 px-2 transition-background-color hover:bg-neutral-4">
      <div class="i-line-md-image-twotone text-neutral-8" />
    </a>
  </div>
</div>
