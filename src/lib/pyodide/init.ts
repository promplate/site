import * as env from "$env/static/public";
import { cacheSingleton } from "$lib/utils/cache";
import { withToast } from "$lib/utils/toast";
import { version } from "pyodide/package.json";
import { toast } from "svelte-sonner";

const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

async function initPyodide() {
  const { loadPyodide } = await import("pyodide");
  return await loadPyodide({ indexURL, env: { ...env } });
}

async function initPy() {
  const [py, { AsyncClient }, version, { default: initCode }] = await Promise.all([
    initPyodide(),
    import("./translate"),
    import("openai/version"),
    import("./init.py?raw"),
  ]);
  const info = toast.loading("installing python dependencies");

  py.registerJsModule("openai", { AsyncClient, Client: () => null, version, __all__: [] });
  py.registerJsModule("httpx", { AsyncClient: () => null, Client: () => null });

  await py.loadPackage("micropip");
  await py.runPythonAsync(initCode);

  toast.dismiss(info);

  return py;
}

export const getPy = cacheSingleton(withToast(initPy, { loading: "preparing pyodide runtime", success: `successfully loaded pyodide v${version}` }));

export async function initConsole() {
  const [py, { default: initConsoleCode }] = await Promise.all([getPy(), import("./console.py?raw")]);
  await py.runPythonAsync(initConsoleCode);
}
