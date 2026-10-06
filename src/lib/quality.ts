export type GeneratedImage = { url:string; width?:number; height?:number; content_type?:string };
export function runBasicQualityGate(image: GeneratedImage) {
  const delivered = Boolean(image.url);
  const known = typeof image.width === "number" && typeof image.height === "number";
  const minimumResolution = known ? Math.min(image.width ?? 0,image.height ?? 0) >= 960 : null;
  return {
    passed: delivered && minimumResolution !== false,
    checks:{ delivered, dimensionsKnown:known, minimumResolution },
    note:"MVP gate verifies delivery and output resolution. Identity similarity and artifact scoring are not faked."
  };
}
