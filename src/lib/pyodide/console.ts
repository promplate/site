import initConsoleCode from "./console.py?raw";

import { getPy } from "./init";

export async function initConsole() {
  const py = await getPy();
  await py.runPythonAsync(initConsoleCode);
  return py.globals.get("console");
}
