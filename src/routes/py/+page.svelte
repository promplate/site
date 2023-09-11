<script>
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import { examplePythonScript } from "$lib";
</script>

<div class="grid min-h-screen place-items-center whitespace-nowrap bg-neutral-9 p-10 text-white">
  <div class="flex flex-row gap-10">
    <div class="flex flex-col items-end justify-between gap-5 py-5">
      <div />
      <div class="relative flex flex-col translate-y-10 items-end gap-6">
        <div class="absolute text-50 -translate-y-30">
          <a class="op-30 transition-opacity hover:op-40" href="https://pypi.org/project/promplate/">
            <div class="i-simple-icons-pypi" />
          </a>
        </div>
        <div class="flex flex-col items-end gap-1">
          <h1 class="text-2xl font-bold font-mono text-shadow-md text-shadow-color-black">&lt;/promplate/&gt;</h1>
          <h2 class="text-xs tracking-1 font-serif uppercase text-white">the prompting framework</h2>
        </div>
        <div class="flex flex-row gap-3">
          <a href="https://pepy.tech/project/promplate">
            <img src="https://static.pepy.tech/badge/promplate/week" alt="weekly downloads" />
          </a>
          <a href="https://pepy.tech/project/promplate">
            <img src="https://static.pepy.tech/badge/promplate/month" alt="monthly downloads" />
          </a>
        </div>
      </div>
      <div class="w-full flex flex-col items-end gap-4">
        <hr class="w-85% op-10" />
        <a href="https://promplate.dev/" class="text-sm font-light op-80 transition-opacity hover:op-100">
          <div class="select-none font-mono">
            <span class="op-30">https://</span>promplate.dev<span class="op-30">/</span>
          </div>
        </a>
      </div>
    </div>
    <CodeBlock code={examplePythonScript} />
  </div>
</div>
