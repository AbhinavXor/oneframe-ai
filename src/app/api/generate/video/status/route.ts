import { NextResponse } from "next/server";
import { configureFal } from "@/lib/fal";
import { VIDEO_MODEL } from "@/lib/providers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = new URL(request.url).searchParams.get("requestId");
  if (!requestId) return NextResponse.json({error:"requestId is required."},{status:400});

  try {
    const client = configureFal();
    const status = await client.queue.status(VIDEO_MODEL,{requestId,logs:false});
    if (status.status !== "COMPLETED") return NextResponse.json({status:status.status});
    const result = await client.queue.result(VIDEO_MODEL,{requestId});
    const data = result.data as {video?:{url?:string}};
    return NextResponse.json({status:"COMPLETED",videoUrl:data.video?.url ?? null});
  } catch (error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Could not read video status."},{status:500});
  }
}
