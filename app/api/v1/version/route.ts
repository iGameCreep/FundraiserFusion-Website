import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
    return Response.json({
        versionNumber: "1.0.0",
        fullVersion: "1.0.0-DEV",
    });
}
