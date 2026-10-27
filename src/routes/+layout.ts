import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit-next";
import { dev } from "$app/env";

inject({ mode: dev ? "development" : "production" });
injectSpeedInsights();
