import { sveltekitOG } from "@ethercorps/sveltekit-og/plugin";
import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";
import remarkToc from "remark-toc";
import Unocss from "unocss/vite";
import { defineConfig } from "vite";

const mdsvexConfig = { extensions: [".svx"], smartypants: { dashes: "oldschool" }, remarkPlugins: [remarkCjkFriendly, remarkToc], rehypePlugins: [rehypeUnwrapImages, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] };

export default defineConfig({
  plugins: [Unocss(), sveltekitOG(), sveltekit({
    extensions: [".svelte", ...mdsvexConfig.extensions],
    // @ts-expect-error mdsvex types plugins as `Transformer<Node>`, which rejects plugins typed for `Root`
    preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
    adapter: adapter({ isr: { expiration: false } }),
    // Kit 3 no longer provides `$lib`, keep it so existing imports work
    alias: { $lib: "./src/lib" },
  })],
});
