import type { Config } from "@sveltejs/adapter-vercel";

import { text } from "@sveltejs/kit";
import { pull } from "$lib/hub";

interface Message {
  id: string[];
  kwargs: { content?: string; prompt?: { kwargs: { template: string; input_variables: string[] } } };
}

interface Prompt {
  id: string[];
  kwargs: { messages: Message[] };
}

function parseRole(type: string) {
  switch (type.at(0)) {
    case "A":
      return "assistant";
    case "H":
      return "user";
    case "S":
      return "system";
  }
}

function translatePrompt(template: string, input_variables: string[]) {
  let text = template.replaceAll("{{", "{").replaceAll("}}", "}");
  for (const name of input_variables)
    text = text.replaceAll(`{${name}}`, `{{ ${name} }}`);

  return text;
}

export async function GET({ params }) {
  const { path } = params;
  try {
    const data = JSON.parse(await pull(path)) as Prompt;

    const messages = data.kwargs.messages.map(({ id, kwargs: { prompt, content } }) => {
      if (content)
        return { role: parseRole(id.at(-1) as string), content: content.replaceAll("{{", "{").replaceAll("}}", "}") };

      const {
        kwargs: { template, input_variables },
      } = prompt!;
      return { role: parseRole(id.at(-1) as string), content: translatePrompt(template, input_variables) };
    });
    const template = messages.map(({ role, content }) => `<|${role}|>\n${content}`).join("\n");
    return text(template, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  catch (e) {
    console.error(e);
    return text("", { status: 404 });
  }
}

// @ts-expect-error override isr config
export const config: Config = { runtime: "edge", isr: false };
