import { loadPyodide, type PyodideInterface } from "pyodide";
import initCode from "./init.py?raw";
import { AsyncClient } from "./translate";
import { version } from "pyodide/package.json";
import * as env from "$env/static/public";

let py: PyodideInterface;

export async function getPy() {
  if (typeof py !== "undefined") {
    return py;
  }

  // const indexURL = typeof window === "undefined" ? undefined : (process.env.NODE_ENV === "production" && env.PUBLIC_PYODIDE_INDEX_URL) || "/pyodide/";
  const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

  py = await loadPyodide({ indexURL, env: { ...env } });
  await py.loadPackage("micropip");
  py.registerJsModule("openai", { AsyncClient, Client: null, version: await import("openai/version"), __all__: [] });
  await py.runPythonAsync(initCode);
  return py;
}
