# type: ignore

prompt: str  # from the left panel

from promplate import Template
from promplate.llm.openai import AsyncChatOpenAI

template = Template(prompt)

llm = AsyncChatOpenAI().bind(model="gpt-3.5-turbo-0125")

async for delta in llm.generate(await template.arender(locals())):
    print(delta, end="", flush=True)
