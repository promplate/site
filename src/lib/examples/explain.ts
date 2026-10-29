import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

import getTemplates from "../../templates";
import initPromplate from "../pyodide/entries";
import { getPy } from "../pyodide/init";

export async function* explain(traceback: string, code: string, signal: AbortSignal) {
  if (signal.aborted)
    return;
  const { parse_chat_markup } = await initPromplate();
  if (signal.aborted)
    return;

  const context = await getTemplates();
  const prompt = await context.ExplainError.arender({ ...context, traceback, code });
  if (signal.aborted)
    return;

  const py = await getPy();
  const createClient = py.pyimport("openai.AsyncClient");
  let client: OpenAI;
  try {
    client = createClient();
  }
  finally {
    createClient.destroy();
  }

  const stream = await client.chat.completions.create({ messages: parse_chat_markup(prompt) as ChatCompletionMessageParam[], model: "gpt-4o-mini", temperature: 0, stream: true }, { signal });
  for await (const event of stream)
    yield event.choices[0]?.delta.content ?? "";
}
