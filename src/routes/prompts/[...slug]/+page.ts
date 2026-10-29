import type { PageLoad } from "./$types";

export const load = (async ({ params: { slug } }) => {
  try {
    const { default: prompt } = await import(`../../../templates/${slug}.j2?raw`);
    return { prompt, meta: { title: `Prompt: ${slug}`, description: `Edit and run the ${slug} prompt template.` } };
  }
  catch {
    return {};
  }
}) satisfies PageLoad;
