import type { RequestHandler } from "@sveltejs/kit";
import type { Post } from "$lib/types";
import type { SvelteComponent } from "svelte";

import component from "./OG.svelte";
import { ImageResponse } from "@ethercorps/sveltekit-og";
import { cast } from "$lib/utils/typing";

let fontData: ArrayBuffer | null = null;

export const GET: RequestHandler = async ({ url: { origin }, params, fetch }) => {
  fontData = fontData ?? (await fetch("/HarmonyOS_Sans_SC_Medium.ttf").then(res => res.arrayBuffer()))!;

  const path: string = params.path ?? "";

  const context: { href: string; title?: string; subtitle?: string } = { href: `${origin}/${decodeURI(path)}` };

  if (path.startsWith("py/")) {
    const posts: Post[] = await fetch("/api/docs").then(res => res.json());
    const post = posts.find(post => post.slug === path.replace("py/", ""));
    if (post) {
      context.title = post.title;
      context.subtitle = post.description;
    }
  }
  else if (path === "partial-json-parser") {
    context.title = "解析不完整 JSON";
    context.subtitle = "Streaming LLM generated JSON";
  }
  else if (path === "playground") {
    context.title = "免安装体验 Promplate";
    context.subtitle = "浏览器中的 python 解释器";
  }

  const html = cast<SvelteComponent>(component).render(context).html.replaceAll("class=", "tw=");
  return new ImageResponse(html, { fonts: [{ name: "inter", data: fontData }] });
};
