import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
  try {
    const post = await import(`../../../docs/py/${params.slug}.svx`);
    return {
      content: post.default,
      meta: post.metadata,
    };
  }
  catch (e) {
    error(404, JSON.stringify(e, null, 2));
  }
}) satisfies PageLoad;
