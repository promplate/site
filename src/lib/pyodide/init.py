# type: ignore

from micropip import install

await install(
    [
        "promplate==0.3.4.9",
        "promplate-pyodide==0.0.3.5",
    ],
)
del install

from promplate_pyodide import patch_all

await patch_all()
del patch_all

from promplate import *
from promplate.llm.openai.v1 import *
