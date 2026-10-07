import fs from "node:fs";

const failures = [];

function read(path) {
  if (!fs.existsSync(path)) {
    failures.push(`${path} is missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}

const studio = read("src/components/Studio.tsx");
const route = read("src/app/api/generate/image/route.ts");

if (!studio.includes("/api/generate/image")) {
  failures.push("Studio is not connected to image generation.");
}

if (!studio.includes("Variation")) {
  failures.push("Variation workflow is missing.");
}

if (!studio.includes("Download")) {
  failures.push("Download workflow is missing.");
}

if (!studio.includes("Library")) {
  failures.push("Library workflow is missing.");
}

if (!studio.includes("consent")) {
  failures.push("Photo permission flow is missing.");
}

if (!route.includes("FormData")) {
  failures.push("Image upload API is incomplete.");
}

for (const path of [
  "src/app/api/generate/video",
  "src/components/MotionPanel.tsx",
  "src/lib/video.ts",
  "src/lib/local-motion.ts",
]) {
  if (fs.existsSync(path)) {
    failures.push(`Unfinished feature still ships: ${path}`);
  }
}

console.log("");
console.log("OneFrame image product");
console.log("----------------------");

if (failures.length) {
  failures.forEach((failure) => console.log(`FAIL: ${failure}`));
  process.exit(1);
}

console.log("PASS");
console.log("Focused image-generation product verified.");
