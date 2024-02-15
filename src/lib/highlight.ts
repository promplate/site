import type { ShikijiTransformer } from "shikiji";

import { cacheGlobally } from "./utils/cache";

export async function getHighlighter(lang: string) {
  return await cacheGlobally(`shikiji-${lang}`, async () => {
    const { getHighlighter } = await import("shikiji");
    return await getHighlighter({ themes: ["vitesse-dark"], langs: [lang] });
  })();
}

const transformers: ShikijiTransformer[] = [
  { pre: (node) => { node.properties.tabindex = "-1"; } },
];

export async function highlight(lang: string, code: string) {
  return (await getHighlighter(lang)).codeToHtml(code, { lang, theme: "vitesse-dark", transformers });
}
