import time

from promplate import Node
from promplate.llm.openai import ChatComplete

reply_template = """
<| system |>
current time: {{ time.ctime() }}
<| user |>
Say happy new year to me in no more than 5 words.
Note that you must include the year in the message.
"""

translate_template = """
Translate the following dialog to `ja_JP`:
{{ name.title() }}: {{ __result__ }}
"""

reply = Node(reply_template, temperature=0.8)
translate = Node(translate_template, temperature=0.2)

output = (reply + translate).invoke(
    {"time": time, "name": "muspi merol"},
    ChatComplete().bind(model="gpt-4.1-nano"),
)
