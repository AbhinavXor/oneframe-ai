export type PurposeId = "professional" | "creator" | "cinematic" | "social";
export type LookId = "founder" | "editorial" | "golden-hour" | "city-night" | "film-still" | "clean-studio";

export const PURPOSES = [
  ["professional","Professional","Clean, credible portraits for work and profiles."],
  ["creator","Creator","Editorial images with more personality and texture."],
  ["cinematic","Cinematic","A film-like scene built around your photo."],
  ["social","Social","Natural, shareable images that still feel like you."]
] as const;

export const LOOKS = [
  ["founder","Founder portrait","Warm office daylight · understated"],
  ["editorial","Editorial","Soft contrast · modern"],
  ["golden-hour","Golden hour","Warm sun · natural skin"],
  ["city-night","City night","Low light · restrained colour"],
  ["film-still","Film still","35mm mood · cinematic"],
  ["clean-studio","Clean studio","Crisp · minimal"]
] as const;

export const MOTION_PRESETS = [
  ["subtle","Subtle portrait","Natural micro-expressions, gentle breathing, small realistic head movement, subtle camera drift, preserve identity and facial proportions."],
  ["camera","Slow camera move","Subject remains recognizable while the camera makes a slow cinematic push-in, realistic motion, no warping."],
  ["look","Look to camera","Subtle natural shift of attention toward the camera, soft blink, realistic facial motion, preserve identity."],
  ["cinematic","Cinematic moment","Short cinematic portrait moment with realistic environmental movement, gentle camera motion, preserve identity."]
] as const;
