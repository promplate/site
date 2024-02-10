import * as fs from "fs";
import { createRequire } from "module";
import { resolve, dirname, join } from "path";

const pyodideDir = dirname(createRequire(resolve("node_modules")).resolve("pyodide"));
const targetDir = resolve(join("static", "pyodide"));

if (!fs.existsSync(targetDir)) {
  console.log({ targetDir, pyodideDir });
  fs.symlinkSync(pyodideDir, targetDir);
}
