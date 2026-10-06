import { NextResponse } from "next/server";
import { configureFal } from "@/lib/fal";
import { MOTION_PRESETS } from "@/lib/catalog";
import { selectVideoRoute } from "@/lib/providers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {imageUrl?:string;motion?:string};
    if (!body.imageUrl) return NextResponse.json({error:"Choose an image first."},{status:400});
    const preset = MOTION_PRESETS.find(item=>item[0]===body.motion);
    if (!preset) return NextResponse.json({error:"Choose a motion direction."},{status:400});

    const client = configureFal();
    const route = selectVideoRoute();
    const submitted = await client.queue.submit(route.model,{
      input:{
        image_url:body.imageUrl,
        prompt:preset[2],
        negative_prompt:"warping, face distortion, identity change, melting features, duplicate face, unnatural body motion, sudden camera shake",
        resolution:"720p",
        duration:5
      }
    });

    return NextResponse.json({requestId:submitted.request_id,provider:route.provider,model:route.model});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start video generation.";
    return NextResponse.json({error:message},{status:message.includes("FAL_KEY")?503:500});
  }
}
