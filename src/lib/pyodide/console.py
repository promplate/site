from pyodide.console import PyodideConsole

console = PyodideConsole()

console.push("from promplate import *")
console.push("from promplate.llm.openai import *")
