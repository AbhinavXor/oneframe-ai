# OneFrame

A focused consumer visual-AI product for creating polished images from a single reference photo.

OneFrame keeps the experience simple: upload a photo, optionally describe the result you want, and generate without exposing model settings or provider complexity.

## Product

- Reference-photo image generation
- Drag and drop upload
- Clipboard image paste
- Optional natural-language instructions
- Curated visual directions
- Adjustable transformation strength
- Explicit photo-permission confirmation
- Generation progress states
- Original vs result comparison
- Variations
- Reuse generated images as new sources
- Image download
- Session Library
- Responsive desktop, tablet and mobile interface
- Server-side provider routing
- Provider fallback handling
- Environment-secret isolation
- CI and repository verification

## Architecture

```text
Consumer UI
     |
Image Generation API
     |
Provider Router
   /   |   \
 P1   P2   P3
   \   |   /
Generated Image
     |
Result Experience
  |       |       |
Variation Reuse Download
```

Provider names, model IDs, credentials and infrastructure settings remain outside the normal consumer interface.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- App Router
- CSS Modules
- Stability image generation
- fal.ai integration
- Hugging Face inference tooling

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Verification

```bash
npm run check
npm audit --omit=dev
```

## Privacy and security

Users must confirm that they own an uploaded photo or have permission to use it.

Production deployments should additionally use private object storage, signed URLs, short retention periods, explicit deletion, EXIF stripping, upload validation, rate limiting and abuse controls.

## Status

The core reference-photo image-generation flow is implemented.

Experimental Motion and Avatar features are intentionally not shipped until they meet the same reliability and quality standard.

## Roadmap

- Persistent private asset storage
- Authentication
- Persistent Library
- Identity-preservation evaluation
- Artifact detection
- Automated quality gates
- Candidate generation and ranking
- Smart retries
- Production rate limiting
- End-to-end tests

## Disclaimer

Independent portfolio and product-engineering project. No unmeasured performance or production-scale claims are made.
