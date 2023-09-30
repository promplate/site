import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";


/** @type {import("mdsvex").MdsvexOptions} */
const mdsvexConfig = { extensions: [".svx"], smartypants: { dashes: "oldschool" } };


/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ...mdsvexConfig.extensions],

	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter({ isr: { expiration: false } })
	}
};

export default config;
