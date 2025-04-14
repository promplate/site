# type: ignore

from collections import ChainMap, defaultdict

from promplate import Template
from promplate.llm.openai import AsyncChatOpenAI

template = Template(prompt)

llm = AsyncChatOpenAI().bind(model="gpt-4.1-nano", temperature=0)

context = ChainMap(__builtins__.__dict__, context, defaultdict(lambda: ""))

async for delta in llm.generate(await template.arender(context)):
    print(delta, end="", flush=True)
