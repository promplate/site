export const examplePythonScript = `

from promplate.llm.openai import ChatComplete
from promplate import Node

reply = Node("""
<| system |>
Now is {{ time.localtime() }}
<| user |>
What the time is it?
""".strip(), temperature=0.8)

translate = Node("""
Translate the following dialog to \`ja_JP\`:
{{ name.title() }}: {{ __result__ }}
""".strip(), temperature=0.2)

chain = reply + translate

chain.complete = ChatComplete(model="gpt-3.5-turbo-1106")

def main():
    """🚀 run the chain"""

    import time

    name = "John"

    return chain.run(locals()).result

`.trim();

export const examplePythonOutput = `
>>> chain
</reply/> + </translate/>

>>> main()
'ジョン：現在の時刻は午前2時11分です。'
`.trim();
