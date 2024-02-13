import type { PyProxy } from "pyodide/ffi";
import initConsoleCode from "./console.py?raw";

import { getPy } from "./init";

export type GetWrapped = (obj: PyProxy) => Promise<[unknown, string]>;

export async function initConsole() {
  const py = await getPy();
  await py.runPythonAsync(initConsoleCode);
  return {
    pyConsole: py.globals.get("console"),
    getWrapped: py.globals.get("get_wrapped") as GetWrapped,
  };
}
