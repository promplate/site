<script>
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import { examplePythonOutput, examplePythonScript } from "$lib";
</script>

<div class="grid min-h-screen place-items-center whitespace-nowrap py-10 <sm:pb-6">
  <div class="flex flex-col gap-2 lg:flex-row lg:gap-10">
    <div class="flex flex-col items-center justify-between gap-5 py-5 lg:items-end">
      <div class="<lg:hidden" />
      <div class="relative flex flex-col gap-6 lg:translate-y-10 lg:items-end">
        <div class="absolute text-50 <lg:hidden -translate-y-30">
          <a class="text-white/30 transition-color hover:text-white/40" href="https://pypi.org/project/promplate/">
            <div class="i-simple-icons-pypi" />
          </a>
        </div>
        <div class="flex flex-col items-center gap-3 lg:items-end lg:gap-1">
          <h1 class="text-2xl font-mono lg:(font-semibold text-shadow-md text-shadow-color-black)">
            <span class="mr-0.7 <lg:text-white/30">&lt;/</span>promplate<span class="ml-0.7 <lg:text-white/30">/&gt;</span>
          </h1>
          <h2 class="text-xs tracking-1 font-serif uppercase">the prompting framework</h2>
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
      <div class="w-full flex flex-col items-center gap-4 lg:items-end">
        <div class="h-1.2 w-60% bg-hero-charlie-brown-white/10 lg:w-85%" />
        <a href="https://promplate.dev/" class="text-sm font-light op-80 transition-opacity hover:op-100">
          <div class="select-none font-mono">
            <span class="op-30">https://</span>promplate.dev<span class="op-30">/</span>
          </div>
        </a>
      </div>
    </div>
    <div class="flex flex-col gap-4 lg:max-h-[calc(100vh-5rem)] [&>section]:<sm:w-[calc(100vw-3rem)]">
      <CodeBlock code={examplePythonScript} collapse />
      <CodeBlock code={examplePythonOutput} />
    </div>
  </div>
</div>
