import { pull } from "$lib/hub";
import { text } from "@sveltejs/kit";

interface Message {
  id: string[];
  kwargs: { prompt: { kwargs: { template: string; input_variables: string[] } } };
}

interface Prompt {
  id: string[];
  kwargs: { messages: Message[] };
}

type PromptTemplate = "SystemMessagePromptTemplate" | "HumanMessagePromptTemplate" | "AIMessagePromptTemplate";

function parseRole(type: PromptTemplate) {
  switch (type) {
    case "AIMessagePromptTemplate":
      return "assistant";
    case "HumanMessagePromptTemplate":
      return "user";
    case "SystemMessagePromptTemplate":
      return "system";
  }
}

function translatePrompt(template: string, input_variables: string[]) {
  let text = template;
  for (const name of input_variables) {
    text = text.replaceAll(`{${name}}`, `{{ ${name} }}`);
  }
  return text;
}

export async function GET({ params }) {
  const { path } = params;
  try {
    const data = JSON.parse(await pull(path)) as Prompt;

    const messages = data.kwargs.messages.map(
      ({
        id,
        kwargs: {
          prompt: {
            kwargs: { template, input_variables },
          },
        },
      }) => ({ role: parseRole(id.at(-1) as PromptTemplate), content: translatePrompt(template, input_variables) })
    );
    const template = messages.map(({ role, content }) => `<|${role}|>\n${content}`).join("\n");
    return text(template, { headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch (e) {
    console.error(e);
    return text("", { status: 404 });
  }
}
