import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";
import { configureFal } from "@/lib/fal";

export const runtime = "nodejs";
export const maxDuration = 120;

type Purpose =
  | "professional"
  | "creator"
  | "cinematic"
  | "social";

type Look =
  | "founder"
  | "editorial"
  | "golden"
  | "night"
  | "film"
  | "studio";

type Attempt = {
  provider: string;
  model: string;
  status: "success" | "failed" | "skipped";
  latencyMs: number;
  code?: string;
};

const PURPOSE_PROMPTS: Record<Purpose, string> = {
  professional:
    "Create a credible professional portrait suitable for a founder, work profile or personal brand. Keep it natural, understated and photographic.",
  creator:
    "Create a modern creator portrait with strong but believable editorial photography. It should feel shareable without looking staged or synthetic.",
  cinematic:
    "Create a cinematic photographic moment with believable real-world lighting, lens character and atmosphere. Avoid fantasy-looking AI effects.",
  social:
    "Create a natural lifestyle photograph that feels candid, warm and believable, suitable for a personal social profile.",
};

const LOOK_PROMPTS: Record<Look, string> = {
  founder:
    "Warm office daylight, quiet confidence, restrained styling, premium founder portrait, realistic environment, natural skin texture.",
  editorial:
    "Contemporary editorial photography, soft contrast, considered composition, subtle styling, realistic texture and light.",
  golden:
    "Natural golden-hour sunlight, warm highlights, realistic skin, subtle depth, believable outdoor photographic quality.",
  night:
    "Restrained city-night photography, soft practical lights, realistic low-light exposure, natural contrast and believable colour.",
  film:
    "35mm film-still character, cinematic framing, subtle grain, realistic lens behaviour, natural expression and environment.",
  studio:
    "Clean minimal studio portrait, neutral background, soft controlled photographic lighting, crisp but natural detail.",
};

const PROVIDER_ORDER = (
  process.env.IMAGE_PROVIDER_ORDER ||
  "stability,hf,fal"
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const FAL_MODEL =
  "fal-ai/bytedance/seedream/v4.5/edit";

const HF_MODEL =
  "black-forest-labs/FLUX.2-klein-9B";

const STABILITY_MODEL =
  "sd3.5-medium";

const CIRCUIT_MS = 15 * 60 * 1000;

const circuits: Record<string, number> = {
  stability: 0,
  hf: 0,
  fal: 0,
};

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}

function dataUrl(
  bytes: Buffer,
  contentType: string
) {
  return `data:${contentType};base64,${bytes.toString(
    "base64"
  )}`;
}

function providerError(error: unknown) {
  const value = error as {
    status?: unknown;
    message?: unknown;
    body?: unknown;
  };

  const status =
    typeof value?.status === "number"
      ? value.status
      : undefined;

  const message =
    error instanceof Error
      ? error.message
      : typeof value?.message === "string"
        ? value.message
        : "Provider request failed.";

  let detail = "";

  if (
    value?.body &&
    typeof value.body === "object" &&
    "detail" in value.body
  ) {
    const raw = (
      value.body as Record<string, unknown>
    ).detail;

    if (typeof raw === "string") {
      detail = raw;
    }
  }

  return {
    status,
    message,
    detail,
  };
}

function classify(
  status: number | undefined,
  message: string,
  detail: string
) {
  const text =
    `${message} ${detail}`.toLowerCase();

  if (
    text.includes("exhausted balance") ||
    text.includes("depleted") ||
    text.includes("insufficient credit") ||
    text.includes("purchase pre-paid")
  ) {
    return "CREDITS_EXHAUSTED";
  }

  if (
    text.includes("locked")
  ) {
    return "ACCOUNT_LOCKED";
  }

  if (status === 401) {
    return "UNAUTHORIZED";
  }

  if (status === 403) {
    return "FORBIDDEN";
  }

  if (status === 429) {
    return "RATE_LIMITED";
  }

  if (
    status &&
    status >= 500
  ) {
    return "PROVIDER_5XX";
  }

  return "PROVIDER_ERROR";
}

function openCircuit(
  provider: string,
  code: string
) {
  if (
    [
      "CREDITS_EXHAUSTED",
      "ACCOUNT_LOCKED",
      "RATE_LIMITED",
      "PROVIDER_5XX",
    ].includes(code)
  ) {
    circuits[provider] =
      Date.now() + CIRCUIT_MS;
  }
}

function buildPrompt(
  purpose: Purpose,
  look: Look,
  instruction: string
) {
  const custom = instruction
    .replace(
      /[\u0000-\u001f\u007f]/g,
      " "
    )
    .trim()
    .slice(0, 600);

  return `
SUBJECT PRESERVATION
Preserve the same person's recognizable identity, facial structure, skin tone, age range, hairline and distinctive features. Do not beautify into a different person. Preserve natural asymmetry and real human texture.

PRODUCT GOAL
${PURPOSE_PROMPTS[purpose]}

VISUAL DIRECTION
${LOOK_PROMPTS[look]}

${custom ? `USER DIRECTION\n${custom}` : ""}

PHOTOGRAPHIC QUALITY
The final result must look like a photograph that could genuinely have been taken with a real camera. Preserve realistic pores, hair, fabric, lighting falloff, lens perspective and environmental detail.

AVOID
Waxy skin, excessive retouching, altered facial identity, generic AI beauty, extra facial features, distorted anatomy, duplicate objects, unrealistic eyes, text, logos, watermarks, synthetic glow, fantasy effects, oversharpening.
`.trim();
}

async function stability(
  file: File,
  prompt: string,
  strength: number
) {
  const key =
    process.env.STABILITY_API_KEY?.trim();

  if (!key) {
    throw new Error(
      "STABILITY_API_KEY_MISSING"
    );
  }

  const form = new FormData();

  form.append("prompt", prompt);
  form.append(
    "negative_prompt",
    "altered identity, different person, distorted face, waxy skin, plastic skin, duplicate facial features, deformed anatomy, extra limbs, text, logo, watermark, synthetic AI glow"
  );
  form.append(
    "mode",
    "image-to-image"
  );
  form.append(
    "strength",
    String(strength)
  );
  form.append(
    "model",
    STABILITY_MODEL
  );
  form.append(
    "output_format",
    "jpeg"
  );
  form.append(
    "image",
    file,
    file.name || "source.jpg"
  );

  const response = await fetch(
    "https://api.stability.ai/v2beta/stable-image/generate/sd3",
    {
      method: "POST",
      headers: {
        authorization:
          `Bearer ${key}`,
        accept: "image/*",
        "stability-client-id":
          "OneFrame",
        "stability-client-version":
          "0.2.0",
      },
      body: form,
    }
  );

  if (!response.ok) {
    const detail =
      await response.text();

    const error =
      new Error(
        `Stability returned ${response.status}`
      ) as Error & {
        status?: number;
        body?: unknown;
      };

    error.status =
      response.status;

    error.body = {
      detail,
    };

    throw error;
  }

  const bytes = Buffer.from(
    await response.arrayBuffer()
  );

  if (bytes.length < 1000) {
    throw new Error(
      "Invalid Stability image response."
    );
  }

  return {
    url: dataUrl(
      bytes,
      response.headers.get(
        "content-type"
      ) || "image/jpeg"
    ),
    requestId:
      response.headers.get(
        "x-request-id"
      ) ||
      `stability-${randomUUID()}`,
    model: STABILITY_MODEL,
  };
}

async function huggingFace(
  file: File,
  prompt: string
) {
  const token =
    process.env.HF_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "HF_TOKEN_MISSING"
    );
  }

  const client =
    new InferenceClient(token);

  const bytes =
    Buffer.from(
      await file.arrayBuffer()
    );

  const blob =
    new Blob(
      [bytes],
      {
        type: file.type,
      }
    );

  const result =
    await client.imageToImage({
      provider: "replicate",
      model: HF_MODEL,
      inputs: blob,
      parameters: {
        prompt,
      },
    });

  const output =
    Buffer.from(
      await result.arrayBuffer()
    );

  if (output.length < 1000) {
    throw new Error(
      "Invalid Hugging Face image response."
    );
  }

  return {
    url: dataUrl(
      output,
      result.type || "image/png"
    ),
    requestId:
      `hf-${randomUUID()}`,
    model: HF_MODEL,
  };
}

async function falProvider(
  file: File,
  prompt: string
) {
  const client =
    configureFal();

  const bytes =
    Buffer.from(
      await file.arrayBuffer()
    );

  const source =
    dataUrl(
      bytes,
      file.type
    );

  const result =
    await client.subscribe(
      FAL_MODEL,
      {
        input: {
          prompt,
          image_urls: [source],
          image_size:
            "portrait_4_3",
          num_images: 1,
          max_images: 1,
          enable_safety_checker:
            true,
        },
        logs: false,
      }
    );

  const image =
    (
      result.data as {
        images?: {
          url?: string;
        }[];
      }
    ).images?.[0];

  if (!image?.url) {
    throw new Error(
      "Invalid fal.ai image response."
    );
  }

  return {
    url: image.url,
    requestId:
      result.requestId,
    model: FAL_MODEL,
  };
}

export async function POST(
  request: Request
) {
  const startedAt =
    Date.now();

  const attempts: Attempt[] = [];

  try {
    const form =
      await request.formData();

    const file =
      form.get("image");

    const purpose =
      form.get("purpose");

    const look =
      form.get("look");

    const instructionValue =
      form.get("instruction");

    const consent =
      form.get("consent");

    const strengthValue =
      Number(
        form.get("strength") ||
          "0.45"
      );

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Add a photo before creating.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof purpose !== "string" ||
      !(purpose in PURPOSE_PROMPTS)
    ) {
      return NextResponse.json(
        {
          error:
            "Choose what you are making.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof look !== "string" ||
      !(look in LOOK_PROMPTS)
    ) {
      return NextResponse.json(
        {
          error:
            "Choose a visual direction.",
        },
        {
          status: 400,
        }
      );
    }

    if (consent !== "true") {
      return NextResponse.json(
        {
          error:
            "Confirm that you can use this photo.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      return NextResponse.json(
        {
          error:
            "Use a JPG, PNG or WEBP image.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Use an image smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const typedPurpose =
      purpose as Purpose;

    const typedLook =
      look as Look;

    const instruction =
      typeof instructionValue ===
      "string"
        ? instructionValue
        : "";

    const strength =
      clamp(
        Number.isFinite(
          strengthValue
        )
          ? strengthValue
          : 0.45,
        0.3,
        0.65
      );

    const prompt =
      buildPrompt(
        typedPurpose,
        typedLook,
        instruction
      );

    for (
      const provider of
      PROVIDER_ORDER
    ) {
      if (
        circuits[provider] &&
        Date.now() <
          circuits[provider]
      ) {
        attempts.push({
          provider,
          model: "",
          status: "skipped",
          latencyMs: 0,
          code: "CIRCUIT_OPEN",
        });

        continue;
      }

      const providerStarted =
        Date.now();

      try {
        const output =
          provider === "stability"
            ? await stability(
                file,
                prompt,
                strength
              )
            : provider === "hf"
              ? await huggingFace(
                  file,
                  prompt
                )
              : provider === "fal"
                ? await falProvider(
                    file,
                    prompt
                  )
                : null;

        if (!output) {
          continue;
        }

        attempts.push({
          provider,
          model: output.model,
          status: "success",
          latencyMs:
            Date.now() -
            providerStarted,
        });

        return NextResponse.json({
          images: [
            {
              url:
                output.url,
            },
          ],
          requestId:
            output.requestId,
          provider,
          model:
            output.model,
          latencyMs:
            Date.now() -
            startedAt,
          fallbackUsed:
            provider !==
            PROVIDER_ORDER[0],
          attempts:
            process.env.NODE_ENV ===
            "development"
              ? attempts
              : undefined,
        });
      } catch (error) {
        const info =
          providerError(
            error
          );

        const code =
          classify(
            info.status,
            info.message,
            info.detail
          );

        attempts.push({
          provider,
          model:
            provider === "stability"
              ? STABILITY_MODEL
              : provider === "hf"
                ? HF_MODEL
                : FAL_MODEL,
          status: "failed",
          latencyMs:
            Date.now() -
            providerStarted,
          code,
        });

        openCircuit(
          provider,
          code
        );

        console.error(
          "[OneFrame provider failed]",
          {
            provider,
            code,
            status:
              info.status,
            message:
              info.message,
            detail:
              info.detail,
          }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Image creation is temporarily unavailable. Please try again shortly.",
        code:
          "ALL_PROVIDERS_UNAVAILABLE",
        ...(process.env.NODE_ENV ===
        "development"
          ? {
              attempts,
            }
          : {}),
      },
      {
        status: 503,
      }
    );
  } catch (error) {
    console.error(
      "[OneFrame route error]",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while preparing your image. Please try again.",
        code:
          "GENERATION_ROUTE_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}
