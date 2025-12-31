import type { NextRequest } from "next/server";
import connectMongoDB from "@/lib/server/database";
import EventFile from "@/lib/server/database/models/eventFile";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    const { data } = await request.json();

    if (!data) {
        return new Response("No data provided.", { status: 400 });
    }
    if (typeof data.b64 !== "string") {
        return new Response("Invalid data provided.", { status: 400 });
    }

    await connectMongoDB();

    const id = nanoid(8);
    const fileObject = {
        id: id,
        b64: data.b64,
    };

    const eventFile = new EventFile(fileObject);
    await eventFile.save();

    return Response.json(fileObject);
}
