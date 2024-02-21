import type * as Core from "openai/core";
import type { PyProxy } from "pyodide/ffi";

import { env } from "$env/dynamic/public";
import { type ClientOptions, OpenAI } from "openai";

interface PyClientOptions {
  api_key?: string;
  base_url?: string;
  organization?: string;
  timeout?: number;
  max_retries?: number;
  defaultHeaders?: PyProxy;
  defaultQuery?: PyProxy;
}

export function toJs(obj: PyProxy) {
  return obj.toJs({ dict_converter: Object.fromEntries });
}

export async function toPyOptions(options: ClientOptions) {
  const { getPy: initPy } = await import("./init");

  const py = await initPy();

  return {
    api_key: options.apiKey,
    base_url: options.baseURL,
    organization: options.organization,
    timeout: options.timeout,
    max_retries: py.toPy(options.maxRetries),
    defaultHeaders: py.toPy(options.defaultHeaders),
    http_client: null,
  } as PyClientOptions;
}

export function toJsOptions(options: PyClientOptions) {
  return {
    baseURL: options.base_url ?? env.PUBLIC_OPENAI_API_BASE,
    apiKey: options.api_key ?? env.PUBLIC_OPENAI_API_KEY ?? "",
    organization: options.organization,
    timeout: options.timeout,
    maxRetries: options.max_retries,
    defaultQuery: options.defaultQuery?.toJs() as Core.DefaultQuery,
    defaultHeaders: options.defaultHeaders?.toJs() as Core.Headers,
    dangerouslyAllowBrowser: true,
  } as ClientOptions;
}

export function AsyncClient(options: PyClientOptions) {
  return new OpenAI(toJsOptions(options));
}
