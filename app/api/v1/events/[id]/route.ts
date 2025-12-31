import type { NextRequest } from "next/server";
import connectMongoDB from "@/lib/server/database";
import EventFile from "@/lib/server/database/models/eventFile";
import { cleanMongoObject } from "@/lib/utils/clean";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/v1/events/[id]">
) {
    const { id } = await ctx.params;

    if (!id) {
        return new Response("Missing ID parameter", { status: 400 });
    }

    await connectMongoDB();
    const eventFile = await EventFile.findOne({
        id: id,
    });

    if (!eventFile) {
        return new Response(null, { status: 404 });
    }

    const cleaned = cleanMongoObject(eventFile);
    return Response.json(cleaned);
}
