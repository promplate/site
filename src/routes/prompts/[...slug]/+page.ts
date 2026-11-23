import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

const prompts = import.meta.glob<string>("/src/templates/*.j2", { query: "?raw", import: "default" });

export const load = (async ({ params: { slug } }) => {
  const getPrompt = prompts[`/src/templates/${slug}.j2`];
  if (!getPrompt)
    error(404, "Prompt not found");
  const prompt = await getPrompt();
  return { prompt, meta: { title: `Prompt: ${slug}`, description: `Edit and run the ${slug} prompt template.` } };
}) satisfies PageLoad;
