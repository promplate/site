import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetUno, presetWebFonts, presetIcons, presetTypography, transformerDirectives, transformerVariantGroup } from "unocss";
import { presetHeroPatterns } from "@julr/unocss-preset-heropatterns";

const config = defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetUno(), presetWebFonts({ provider: "bunny", fonts: { mono: "Fira Code:300,400,500,600,700" } }), presetIcons(), presetHeroPatterns(), presetTypography()],
});

export default config;
