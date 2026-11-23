import type { PageLoad } from "./$types";
import type { Post } from "$lib/types";
import type { Component } from "svelte";

import { error } from "@sveltejs/kit";

const posts = import.meta.glob<{ default: Component; metadata: Omit<Post, "slug"> }>("/src/docs/py/*.svx");

export const load = (async ({ params }) => {
  const getPost = posts[`/src/docs/py/${params.slug}.svx`];
  if (!getPost)
    error(404, "Document not found");
  const post = await getPost();
  return {
    content: post.default,
    meta: post.metadata,
  };
}) satisfies PageLoad;
