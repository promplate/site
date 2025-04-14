import time

from promplate import Node
from promplate.llm.openai import ChatComplete

# 用日语撰写一段祝福
reply_template = """
<| system |>
current time: {{ time.ctime() }}
<| user |>
Say happy new year to me in native Japanese.
Note that you must include the year in the message.
"""

# 翻译成中文
translate_template = """
Translate the following dialog to `zh_CN`:
{{ name.title() }}: {{ __result__ }}
"""

reply = Node(reply_template, temperature=0.8)
translate = Node(translate_template, temperature=0.2)

# 获得一段日系祝福
chain = reply + translate

output = chain.invoke(
    {"time": time, "name": "muspi merol"},
    ChatComplete().bind(model="gpt-4.1-nano"),
)  # 大约等待 3 秒，这期间会请求两次 OpenAI
