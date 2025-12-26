import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import connectMongoDB from "@/lib/server/database";
import EventFile from "@/lib/server/database/models/event-file";

export async function POST(request: NextRequest) {
    const { data } = await request.json();

    if (!data) {
        return new Response("No data provided.", { status: 400 });
    }
    if (typeof data.b64 !== "string") {
        return new Response("Invalid data provided.", { status: 400 });
    }

    await connectMongoDB();

    const id = randomUUID();
    const eventFile = new EventFile({
        id: id,
        b64: data.b64,
    });

    await eventFile.save();

    return Response.json(eventFile);
}
