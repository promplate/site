import type { PageLoad } from "./$types";

export const load = (async ({ params: { slug } }) => {
  try {
    const { default: prompt } = await import(`../../../templates/${slug}.j2?raw`);
    return { prompt };
  }
  catch (_) {
    return {};
  }
}) satisfies PageLoad;
