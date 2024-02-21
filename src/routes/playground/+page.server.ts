import type { Actions } from "./$types";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    return Object.fromEntries(data.entries()) as { source: string };
  },
} satisfies Actions;
