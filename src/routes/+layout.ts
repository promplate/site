import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
import { dev } from "$app/environment";

inject({ mode: dev ? "development" : "production" });
injectSpeedInsights();

export const prerender = true;
