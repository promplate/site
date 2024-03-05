<script lang="ts">
  import * as env from "$env/static/public";
  import CodeBlock from "$lib/components/CodeBlock.svelte";
  import beautify from "json-beautify";
  import { OpenAI } from "openai";
  import { parse } from "partial-json";
  import { onMount } from "svelte";

  const openai = new OpenAI({ apiKey: env.PUBLIC_OPENAI_API_KEY ?? "", baseURL: env.PUBLIC_OPENAI_BASE_URL, dangerouslyAllowBrowser: true });

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

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "your answer should be a valid JSON string, with no code block. Just the JSON, without anything else." },
        { role: "user", content: "I am learning JSON. Please give me a complex nested JSON example containing short strings, arrays, objects, NaN, Infinity, booleans, null, scientific notation floats and a few emojis represented by unicode chars. Note that you should beautify your JSON response. 出现的所有字符串都用中文。" },
      ],
      temperature: 1.1,
      stream: true,
    });

    loading = false;
    json_string = "";

    try {
      for await (const chunk of res) {
        const delta = chunk.choices[0].delta.content ?? "";
        if (delta)
          json_string += delta;
      }
    }
    catch (e) {
      json_string = String(e);
    }
    running = false;
  }

  const show = (json_string: string) => {
    try {
      json_string = json_string.substring(json_string.indexOf("{"));
      return beautify(parse(json_string), reviver, 3, 40).replaceAll(String(nanPlaceholder), "NaN").replaceAll(String(infPlaceholder), "Infinity").replaceAll(String(_infPlaceholder), "-Infinity");
    }
    catch (e) {
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
        <div>LLM 流式输出的 JSON</div>
      </div>
      <div class:op-50={loading} class="flex flex-col transition-opacity lg:h-[calc(100vh-18.5rem)]">
        <CodeBlock collapse lang="json" code={json_string} />
      </div>
    </div>
    <div class="w-[calc(100vw-4rem)] 2xl:w-xl lg:w-md md:w-xl sm:w-lg xl:w-lg">
      <div class="mb-5 flex flex-row select-none items-center justify-center gap-1.5 whitespace-nowrap rounded bg-white/3 px-4 py-3 text-sm">
        <div class="i-ri-javascript-fill text-lg text-white/50" />
        <div>解析后的合法 JSON</div>
      </div>
      <div class:op-50={loading} class="flex flex-col transition-opacity lg:h-[calc(100vh-18.5rem)] [&>section]:(b-2 b-white/70)">
        <CodeBlock collapse lang="json" code={show(json_string)} />
      </div>
    </div>
  </div>
  <button class="w-full rounded bg-white py-3 text-neutral-9 font-bold tracking-widest uppercase transition-all hover:bg-white/90" class:op-80={running} on:click={runDemo}>再试一次</button>
</div>
