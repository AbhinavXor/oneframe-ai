export const IMAGE_MODEL =
  "fal-ai/bytedance/seedream/v4.5/edit";


export function selectImageRoute(
  purpose?: string,
  look?: string
) {
  void purpose;
  void look;

  return {
    provider: "fal" as const,
    model: IMAGE_MODEL,
    reason:
      "Identity-reference image generation route.",
  };
}

