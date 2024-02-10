# type: ignore

from micropip import install

await install("promplate-pyodide")
del install

from promplate_pyodide import patch_promplate

patch_promplate(True)

from promplate import *
from promplate.llm.openai import *
