import type { LookId, PurposeId } from "./catalog";

const purposePrompt: Record<PurposeId,string> = {
  professional:"Create a polished founder/professional portrait. Natural, credible, contemporary, not corporate stock photography.",
  creator:"Create a distinctive creator portrait with editorial composition, natural texture, and a believable visual point of view.",
  cinematic:"Create a cinematic portrait scene with film-like composition and lighting while keeping the person realistic and recognizable.",
  social:"Create a natural, shareable portrait that feels spontaneous and flattering without looking over-produced."
};

const lookPrompt: Record<LookId,string> = {
  founder:"Soft window light, understated modern interior, relaxed confident posture, realistic skin texture, 85mm portrait feeling.",
  editorial:"Refined editorial lighting, thoughtful composition, tactile materials, restrained colour, natural skin detail.",
  "golden-hour":"Late-afternoon golden sunlight, soft atmospheric depth, warm realistic colour, effortless outdoor portrait.",
  "city-night":"Believable evening city environment, controlled practical lighting, deep neutral shadows, no neon sci-fi cliché.",
  "film-still":"Quiet 35mm film still, environmental storytelling, realistic depth, subtle grain-like texture, restrained colour.",
  "clean-studio":"Clean studio setup, simple neutral background, flattering soft key light, realistic detail, no distracting props."
};

export function buildImagePrompt(purpose: PurposeId, look: LookId) {
  return [
    "Use the uploaded photograph as the identity reference.",
    "IDENTITY: Preserve the same person, facial proportions, skin tone, age range, recognizable features, hairline and overall identity. Do not beautify into a different person.",
    `OUTCOME: ${purposePrompt[purpose]}`,
    `LOOK: ${lookPrompt[look]}`,
    "CAMERA: Natural photographic perspective, believable depth of field, flattering but realistic lens behaviour.",
    "QUALITY: Photorealistic detail, realistic skin texture, coherent hands if visible, clean eyes and teeth, no duplicated features, no plastic or waxy skin.",
    "AVOID: generic AI glow, excessive smoothing, extra fingers, distorted anatomy, text, logos, watermarks, duplicate faces."
  ].join("\n");
}
