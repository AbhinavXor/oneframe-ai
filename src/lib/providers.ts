/* Provider adapter signatures intentionally reserve purpose/look for provider-specific routing. */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LookId, PurposeId } from "./catalog";
export const IMAGE_MODEL = "fal-ai/bytedance/seedream/v4.5/edit";
export const VIDEO_MODEL = "fal-ai/pika/v2.2/image-to-video";
export function selectImageRoute(_purpose: PurposeId,_look: LookId) {
  return { provider:"fal" as const, model:IMAGE_MODEL, reason:"Active identity-reference image route for the MVP." };
}
export function selectVideoRoute() {
  return { provider:"fal" as const, model:VIDEO_MODEL, reason:"Queued short-form motion route for the MVP." };
}
