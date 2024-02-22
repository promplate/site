import * as fs from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const pyodideDir = dirname(createRequire(resolve("node_modules")).resolve("pyodide"));
const targetDir = resolve(join("static", "pyodide"));

if (!fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { force: true });
  fs.symlinkSync(pyodideDir, targetDir);
}
