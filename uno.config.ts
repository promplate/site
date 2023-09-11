import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetUno, presetWebFonts, presetIcons, transformerDirectives, transformerVariantGroup } from "unocss";

const config = defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetUno(), presetWebFonts({ provider: "bunny", fonts: { mono: "Fira Code:300,400,500,600,700" } }), presetIcons()],
});

export default config;
