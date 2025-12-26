export function encodeB64(data: string) {
    const buffer = Buffer.from(data, "utf8");
    return buffer.toString("base64");
}

export function decodeB64(data: string) {
    const buffer = Buffer.from(data, "base64");
    return buffer.toString("utf8");
}
