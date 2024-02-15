import type { Post } from "$lib/types";

import { json } from "@sveltejs/kit";

const paths = import.meta.glob("/src/docs/*/*.svx", { eager: true });

const posts: Post[] = [];

async function getPosts() {
  posts.length = 0;

  for (const p in paths) {
    const file = paths[p];

    const slug = p.split("/").at(-1)?.replace(".svx", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;
      const post = { slug, ...metadata } satisfies Post;
      posts.push(post);
    }
  }

  return posts;
}

export async function GET() {
  return json(posts.length ? posts : await getPosts());
  // return json(await getPosts());
}
