import { ImageResponse } from "@ethercorps/sveltekit-og";
import type { RequestHandler } from "@sveltejs/kit";
import component from "./OG.svelte";

export const GET: RequestHandler = async ({ url: { href } }) => {
  if (href.endsWith("?")) href = href.slice(0, -1);
  const html = component.render({ href: decodeURI(href) }).html.replaceAll("class=", "tw=");
  return await ImageResponse(html, {});
};
