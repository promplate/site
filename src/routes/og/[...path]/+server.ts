import { ImageResponse } from "@ethercorps/sveltekit-og";
import type { RequestHandler } from "@sveltejs/kit";
import { SvelteComponent } from "svelte";
import { cast } from "$lib/utils/typing";
import type { Post } from "$lib/types";
import component from "./OG.svelte";

let fontData: ArrayBuffer | null = null;

export const GET: RequestHandler = async ({ url: { origin }, params, fetch }) => {
  fontData = fontData ?? (await fetch("/inter-latin-600-normal.ttf").then((res) => res.arrayBuffer()))!;

  const path: string = params.path ?? "";

  const context: { href: string; title?: string; subtitle?: string } = { href: `${origin}/${decodeURI(path)}` };

  if (path.startsWith("py/")) {
    const posts: Post[] = await fetch("/api/docs").then((res) => res.json());
    const post = posts.find((post) => post.slug === path.replace("py/", ""));
    if (post) {
      context.title = post.title;
      context.subtitle = post.description;
    }
  } else if (path === "partial-json-parser") {
    context.title = "Partial JSON Parsing Demo";
    context.subtitle = "Streaming LLM generated JSON";
  }

  const html = cast<SvelteComponent>(component).render(context).html.replaceAll("class=", "tw=");
  return new ImageResponse(html, { fonts: [{ name: "inter", data: fontData }] });
};
