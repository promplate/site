import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkToc from "remark-toc";

/** @type {import("mdsvex").MdsvexOptions} */
const mdsvexConfig = { extensions: [".svx"], smartypants: { dashes: "oldschool" }, remarkPlugins: [remarkToc], rehypePlugins: [rehypeUnwrapImages, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] };

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

  kit: {
    adapter: adapter({ isr: { expiration: false } }),
  },
};

export default config;
