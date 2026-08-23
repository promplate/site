import { renderMarkdown } from "./markdown";
import { describe, expect, it } from "bun:test";

describe("renderMarkdown", () => {
  it("renders bold CJK text ending in punctuation", async () => {
    await expect(renderMarkdown("中文**加粗。**文本")).resolves.toBe("<p>中文<strong>加粗。</strong>文本</p>");
  });
});
