import { ImageResponse } from "@ethercorps/sveltekit-og";
import type { RequestHandler } from "@sveltejs/kit";
import type { Post } from "$lib/types";
import component from "./OG.svelte";

export const GET: RequestHandler = async ({ url: { href, pathname }, fetch }) => {
  if (href.endsWith("?")) href = href.slice(0, -1);
  href = href.replace("/og/", "/");
  pathname = pathname.replace("/og/", "/");
  // after normalization

  const context: { href: string; title?: string; subtitle?: string } = { href: decodeURI(href) };

  if (pathname.startsWith("/py/")) {
    const posts: Post[] = await fetch("/api/docs").then((res) => res.json());
    const post = posts.find((post) => post.slug === pathname.replace("/py/", ""));
    if (post) {
      context.title = post.title;
      context.subtitle = post.description;
    }
  }

  const html = component.render(context).html.replaceAll("class=", "tw=");
  return await ImageResponse(html, {});
};
