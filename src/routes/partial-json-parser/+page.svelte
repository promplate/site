<script lang="ts">
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import { parse } from "partial-json";
  import { OpenAI } from "openai";
  import { onMount } from "svelte";
  import * as env from "$env/static/public";
  import beautify from "json-beautify";

  const openai = new OpenAI({ apiKey: env.PUBLIC_OPENAI_API_KEY ?? "", baseURL: env.PUBLIC_OPENAI_API_BASE, dangerouslyAllowBrowser: true });

  let running = false;
  let loading = true;

  const nanPlaceholder = Math.random();
  const infPlaceholder = Math.random();
  const _infPlaceholder = Math.random();

  function reviver(_: string, value: unknown) {
    if (value === Infinity) return infPlaceholder;
    if (value === -Infinity) return _infPlaceholder;
    if (Number.isNaN(value)) return nanPlaceholder;
    return value;
  }

  async function runDemo() {
    if (running) return;

    running = true;
    loading = true;

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "your answer should be a valid JSON string, with no code block. Just the JSON, without anything else." },
        { role: "user", content: "I am learning JSON. Please give me a complex nested JSON example containing short strings, arrays, objects, NaN, Infinity, booleans, null, scientific notation floats and lots of emojis represented by unicode chars." },
      ],
      temperature: 1.1,
      stream: true,
    });

    loading = false;
    json_string = "";

    try {
      for await (const chunk of res) {
        const delta = chunk.choices[0].delta.content ?? "";
        if (delta) json_string += delta;
      }
    } catch (e) {
      json_string = String(e);
    }
    running = false;
  }

  let json_string = "";

  const show = (json_string: string) => {
    try {
      return beautify(parse(json_string), reviver, 3, 35).replaceAll(String(nanPlaceholder), "NaN").replaceAll(String(infPlaceholder), "Infinity").replaceAll(String(_infPlaceholder), "-Infinity");
    } catch (e) {
      return "";
    }
  };

  onMount(runDemo);
</script>

<div class="m-8 flex flex-col-reverse items-center gap-6 lg:m-20 md:m-16 sm:m-12 lg:flex-col">
  <div class="w-full flex flex-col-reverse gap-6 lg:flex-row">
    <div class="w-[calc(100vw-4rem)] 2xl:w-xl lg:w-md md:w-xl sm:w-lg xl:w-lg">
      <div class="mb-5 flex flex-row select-none items-center justify-center gap-1.5 whitespace-nowrap rounded bg-white/3 px-4 py-3 text-sm">
        <div class="i-ri-openai-fill text-lg text-white/50" />
        <div>Raw Partial JSON</div>
      </div>
      <div class:op-50={loading} class="flex flex-col transition-opacity lg:h-[calc(100vh-18.5rem)]">
        <CodeBlock collapse lang="json" code={json_string} />
      </div>
    </div>
    <div class="w-[calc(100vw-4rem)] 2xl:w-xl lg:w-md md:w-xl sm:w-lg xl:w-lg">
      <div class="mb-5 flex flex-row select-none items-center justify-center gap-1.5 whitespace-nowrap rounded bg-white/3 px-4 py-3 text-sm">
        <div class="i-ri-javascript-fill text-lg text-white/50" />
        <div>Parsed Partial JSON</div>
      </div>
      <div class:op-50={loading} class="flex flex-col transition-opacity lg:h-[calc(100vh-18.5rem)] [&>section]:(b-2 b-white/70)">
        <CodeBlock collapse lang="json" code={show(json_string)} />
      </div>
    </div>
  </div>
  <button class="w-full rounded bg-white py-3 font-bold tracking-widest uppercase text-neutral-9 transition-all hover:bg-white/90" class:op-80={running} on:click={runDemo}>show another example</button>
</div>
