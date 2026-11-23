import type { ShikiTransformer } from "shiki";

import { cacheOnce } from "./utils/cache";

export async function getTheme() {
  const { bundledThemes } = await import("shiki");
  const { default: theme } = await bundledThemes["vitesse-dark"]();
  const tokenColors = [...(theme.tokenColors ?? []), { scope: ["comment", "punctuation.definition.comment", "string.comment"], settings: { foreground: "#758575" } }];
  return { ...theme, tokenColors };
}

export async function getHighlighter(lang: string) {
  return await cacheOnce(`shiki-${lang}`, async () => {
    const { createHighlighter } = await import("shiki");
    return await createHighlighter({ themes: [await getTheme()], langs: [lang] });
  })();
}

const transformers: ShikiTransformer[] = [
  { pre: (node) => { node.properties.tabindex = "-1"; } },
];

export async function highlight(lang: string, code: string) {
  return (await getHighlighter(lang)).codeToHtml(code, { lang, theme: "vitesse-dark", transformers });
}
