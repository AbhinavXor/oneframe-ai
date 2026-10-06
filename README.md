# OneFrame

Independent B2C visual-AI product prototype.

## Working proof
- Promptless photo → outcome → visual direction flow
- Server-side `@fal-ai/client` integration
- Reference-photo image generation
- Image → queued short-form video
- Provider routing boundary
- Basic delivery/resolution gate
- Responsive consumer UI
- `/lab`, `/ops`, and `/privacy` proof routes

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Put a real `FAL_KEY` in `.env.local`.

Image route: `fal-ai/bytedance/seedream/v4.5/edit`
Video route: `fal-ai/pika/v2.2/image-to-video`

The current quality gate does not claim identity-similarity or aesthetic scoring. Those are Phase 2 work.

Independent portfolio prototype. Not affiliated with Aurify.
