import type { Theme } from "unocss/preset-wind3";

import { presetHeroPatterns } from "@julr/unocss-preset-heropatterns";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetIcons, presetTypography, presetWebFonts, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss";

const typography = presetTypography<Theme>({
  // The preset before v66.5 never defined these variables, so prose colors were inherited from the page
  colorScheme: Object.fromEntries(["body", "headings", "lead", "links", "bold", "counters", "bullets", "hr", "quotes", "quote-borders", "captions", "kbd", "kbd-shadows", "code", "pre-code", "pre-bg", "th-borders", "td-borders"].map(key => [key, "inherit"])),
  // The site's styles were built on the compact defaults before v66.5, so keep them when upgrading the preset
  cssExtend: ({ fontFamily }) => ({
    "font-size": "inherit",
    "line-height": "inherit",
    "p": { "margin-top": "1em", "margin-bottom": "1em", "line-height": "1.75" },
    "ol": { "margin-top": "1em", "margin-bottom": "1em", "padding-inline-start": "1.25em", "line-height": "1.75" },
    "ul": { "margin-top": "1em", "margin-bottom": "1em", "padding-inline-start": "1.25em", "line-height": "1.75" },
    "li": { "margin-top": "0", "margin-bottom": "0" },
    "ol > li": { "padding-inline-start": "0" },
    "ul > li": { "padding-inline-start": "0" },
    // The preset splits selectors at ::, so pseudo-element keys must stay separate.
    "ol > li::marker": { "font-weight": "inherit" },
    "ul ul, ul ol, ol ul, ol ol": { "margin-top": "1em", "margin-bottom": "1em" },
    "hr + *, h2 + *, h3 + *, h4 + *": { "margin-top": "1em" },
    "strong": { "font-weight": "bolder" },
    "hr": { margin: "2em 0", border: "1px solid var(--un-prose-hr)" },
    "blockquote": { "margin": "1em 0", "font-weight": "inherit", "border-inline-start": ".25em solid var(--un-prose-quote-borders)" },
    "blockquote p:first-of-type::before": { content: "none" },
    "blockquote p:last-of-type::after": { content: "none" },
    "h1": { "margin": "1rem 0", "font-weight": "600", "line-height": "1.25" },
    "h2": { "margin": "1.75em 0 .5em", "font-weight": "600", "font-size": "1.75em", "line-height": "1.25" },
    "h3": { "margin": "1.5em 0 .5em", "font-size": "1.375em", "line-height": "1.25" },
    "h4": { "margin": "1em 0", "font-size": "1.125em", "line-height": "1.25" },
    "h5, h6": { "font-weight": "600", "line-height": "1.25" },
    "h3 code": { "font-size": ".875em" },
    "img": { margin: "0" },
    "code": { "font-family": fontFamily!.mono },
    "pre": { "color": "inherit", "background-color": "transparent", "font-weight": "inherit", "font-size": "inherit", "line-height": "1.75", "margin": "1em 0", "padding": "1.25rem 1.5rem" },
    "pre code": { "font-size": ".875em", "font-family": fontFamily!.mono },
    "pre, code": { "white-space": "pre", "word-spacing": "normal", "word-break": "normal", "overflow-wrap": "normal", "tab-size": "4", "hyphens": "none" },
    "table": { "display": "block", "margin": "1em 0", "font-size": "inherit", "line-height": "inherit", "overflow-x": "auto" },
    "thead": { "border-bottom-width": "0" },
    "thead th": { "color": "inherit", "font-weight": "bold", "vertical-align": "middle", "padding": ".625em 1em" },
    "tbody tr": { "border-bottom-width": "0" },
    "tbody td": { "vertical-align": "middle" },
    "tbody td, tfoot td": { padding: ".625em 1em" },
    "thead th:first-child": { "padding-inline-start": "1em" },
    "thead th:last-child": { "padding-inline-end": "1em" },
    "tbody td:first-child, tfoot td:first-child": { "padding-inline-start": "1em" },
    "tbody td:last-child, tfoot td:last-child": { "padding-inline-end": "1em" },
    "details": { margin: "1em 0", padding: "1.25rem 1.5rem" },
    "summary": { "cursor": "pointer", "font-weight": "600" },
  }),
});

const config = defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetWind3({ preflight: "on-demand" }), presetWebFonts({ provider: "bunny", fonts: { mono: "Fira Code:300,400,500,600,700" } }), presetIcons(), presetHeroPatterns(), typography],
});

export default config;
