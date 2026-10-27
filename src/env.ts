import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  LANGCHAIN_API_KEY: { static: true, schema: value => value },
  PUBLIC_HEAD_SCRIPTS: { public: true, static: true, schema: value => value },
  PUBLIC_OPENAI_API_KEY: { public: true, static: true, schema: value => value },
  PUBLIC_OPENAI_BASE_URL: { public: true, static: true, schema: value => value },
  PUBLIC_PYODIDE_INDEX_URL: { public: true, static: true, schema: value => value },
});
