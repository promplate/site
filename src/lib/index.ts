export const examplePythonScript = `

from promplate.llm.openai import chat_complete
from promplate import ChatTemplate, Node

reply = Node(ChatTemplate("""
<| system |>
Now is {{ time.localtime() }}
<| user |>
What the time is it?
""".strip()), temperature=0.8)

translate = Node(ChatTemplate("""
<| system |>
Translate the following message to \`ja_JP\`:
<| user message_to_translate |>
{{ name.title() }}: {{ __result__ }}
""".strip()), temperature=0.2)

chain = reply + translate
# >>> print(chain)
# </reply/> + </translate/>

complete = chat_complete(model="gpt-3.5-turbo")

def main():
    """🚀 run the chain"""

    import time
    name = "John"

    return chain.run(locals(), complete)["__result__"]


print(main())  # ジョン：現在の時刻は午前2時11分です。

`.trim();
