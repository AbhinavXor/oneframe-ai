import { fal } from "@fal-ai/client";

export function configureFal() {
  const key = process.env.FAL_KEY?.trim();

  if (
    !key ||
    key.includes("YOUR_REAL_FAL_KEY") ||
    key.toUpperCase().includes("REPLACE")
  ) {
    throw new Error(
      "FAL_KEY is not configured. Add a real fal.ai API key to .env.local."
    );
  }

  fal.config({
    credentials: key,
  });

  return fal;
}
