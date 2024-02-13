from pyodide.console import ConsoleFuture, PyodideConsole
from pyodide.ffi import to_js


async def get_wrapped(future: ConsoleFuture):
    res = await future
    return to_js([res, None if res is None else repr(res)], depth=1)


def complete(source: str):
    return to_js(console.complete(source), depth=2)


console = PyodideConsole()

console.push("from promplate import *")
console.push("from promplate.llm.openai import *")
