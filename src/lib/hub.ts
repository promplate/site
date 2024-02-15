import * as env from "$env/static/private";
import { Client } from "langchainhub/client";

const client = new Client({ apiUrl: "https://api.hub.langchain.com", apiKey: env.LANGCHAIN_API_KEY });

export const pull = client.pull.bind(client);
