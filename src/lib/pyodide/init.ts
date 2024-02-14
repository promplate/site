import initConsoleCode from "./console.py?raw";
import initCode from "./init.py?raw";
import { AsyncClient } from "./translate";
import * as env from "$env/static/public";
import { type PyodideInterface, loadPyodide } from "pyodide";
import { version } from "pyodide/package.json";

let py: PyodideInterface;

export async function getPy() {
  if (typeof py !== "undefined")
    return py;

  // const indexURL = typeof window === "undefined" ? undefined : (process.env.NODE_ENV === "production" && env.PUBLIC_PYODIDE_INDEX_URL) || "/pyodide/";
  const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

  py = await loadPyodide({ indexURL, env: { ...env } });
  await py.loadPackage("micropip");
  py.registerJsModule("openai", { AsyncClient, Client: () => null, version: await import("openai/version"), __all__: [] });
  py.registerJsModule("httpx", { AsyncClient: () => null, Client: () => null });
  await py.runPythonAsync(initCode);
  return py;
}

export async function initConsole() {
  const py = await getPy();
  await py.runPythonAsync(initConsoleCode);
}
