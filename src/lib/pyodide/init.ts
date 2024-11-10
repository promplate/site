import type { ClientOptions } from "openai";

import { pyodideReady } from "../stores";
import { getEnv } from "../utils/env";
import * as env from "$env/static/public";
import { cacheSingleton } from "$lib/utils/cache";
import { withToast } from "$lib/utils/toast";
import { toast } from "svelte-sonner";

const indexURL = typeof window === "undefined" ? undefined : (process.env.NODE_ENV === "production" && env.PUBLIC_PYODIDE_INDEX_URL) || "/pyodide/";

async function initPyodide() {
  const { loadPyodide } = await import("pyodide");
  return await loadPyodide({ indexURL, env: getEnv(), packages: ["micropip"] });
}

async function initPy() {
  const [py, { OpenAI }, version, { default: initCode }] = await Promise.all([
    initPyodide(),
    import("openai"),
    import("openai/version"),
    import("./init.py?raw"),
  ]);
  const info = toast.loading("installing extra python dependencies");

  class PatchedOpenAI extends OpenAI {
    constructor(options: ClientOptions) {
      if (!options.apiKey)
        (options.apiKey = env.PUBLIC_OPENAI_API_KEY);
      if (!options.baseURL)
        options.baseURL = env.PUBLIC_OPENAI_BASE_URL;
      super(options);
    }
  }

  py.registerJsModule("openai", { OpenAI: PatchedOpenAI, version, __all__: [] });

  await py.runPythonAsync(initCode);

  toast.dismiss(info);

  pyodideReady.set(true);

  return py;
}

export const getPy = cacheSingleton(withToast(initPy, { loading: "preparing pyodide runtime", success: `successfully initialized pyodide runtime` }));

export async function initConsole() {
  const [py, { default: initConsoleCode }] = await Promise.all([getPy(), import("./console.py?raw")]);
  await py.runPythonAsync(initConsoleCode);
}
