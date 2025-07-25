<script lang="ts">
  import { streamText } from "@xsai/stream-text";
  import * as env from "$env/static/public";
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import beautify from "json-beautify";
  import { parse } from "partial-json";
  import { onMount } from "svelte";

  let running = false;
  let loading = true;
  let json_string = "";

  const nanPlaceholder = Math.random();
  const infPlaceholder = Math.random();
  const _infPlaceholder = Math.random();

  function reviver(_: string, value: unknown) {
    if (value === Number.POSITIVE_INFINITY)
      return infPlaceholder;
    if (value === Number.NEGATIVE_INFINITY)
      return _infPlaceholder;
    if (Number.isNaN(value))
      return nanPlaceholder;
    return value;
  }

  async function runDemo() {
    if (running)
      return;

    running = true;
    loading = true;

    const res = await streamText({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: "your answer should be a valid JSON string, with no code block. Just the JSON, without anything else." },
        { role: "user", content: "I am learning JSON. Please give me a complex nested JSON example containing short strings, arrays, objects, NaN, Infinity, booleans, null, scientific notation floats and a few emojis represented by unicode chars. Note that you should beautify your JSON response." },
      ],
      temperature: 1.1,
      apiKey: env.PUBLIC_OPENAI_API_KEY ?? "",
      baseURL: env.PUBLIC_OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    });

    loading = false;
    json_string = "";

    try {
      for await (const delta of res.textStream) {
        json_string += delta;
      }
    }
    catch (e) {
      json_string = String(e);
    }
    running = false;
  }

  $: pure_json = json_string.substring(json_string.indexOf("{")).replace(/\n`+$/g, "");

  const show = (json_string: string) => {
    try {
      return beautify(parse(json_string), reviver, 3, 40).replaceAll(String(nanPlaceholder), "NaN").replaceAll(String(infPlaceholder), "Infinity").replaceAll(String(_infPlaceholder), "-Infinity");
    }
    catch {
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
        <CodeBlock collapse lang="json" code={pure_json} />
      </div>
    </div>
    <div class="w-[calc(100vw-4rem)] 2xl:w-xl lg:w-md md:w-xl sm:w-lg xl:w-lg">
      <div class="mb-5 flex flex-row select-none items-center justify-center gap-1.5 whitespace-nowrap rounded bg-white/3 px-4 py-3 text-sm">
        <div class="i-ri-javascript-fill text-lg text-white/50" />
        <div>Parsed Partial JSON</div>
      </div>
      <div class:op-50={loading} class="flex flex-col transition-opacity lg:h-[calc(100vh-18.5rem)] [&>section]:(b-2 b-white/70)">
        <CodeBlock collapse lang="json" code={show(pure_json)} />
      </div>
    </div>
  </div>
  <button class="w-full rounded bg-white py-3 text-neutral-9 font-bold tracking-widest uppercase transition-all hover:bg-white/90" class:op-80={running} on:click={runDemo}>show another example</button>
</div>
