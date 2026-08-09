import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Channel } from "@/lib/types";

const FILE_NAME = "channels.json";

export async function GET() {
  try {
    const channels = await readData<Channel[]>(FILE_NAME);

    return NextResponse.json(channels);
  } catch (error) {
    console.error("Failed to read channels:", error);

    return NextResponse.json(
      { error: "Failed to load channels" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const channels = await readData<Channel[]>(FILE_NAME);

    const newChannel: Channel = {
      id:
        channels.length > 0
          ? Math.max(...channels.map((channel) => channel.id)) + 1
          : 1,

      name: body.name,
      streamId: Number(body.streamId),
      stream_type: body.stream_type,
      streamUrl: body.streamUrl,
      logoUrl: body.logoUrl ?? "",
      categoryId: Number(body.categoryId),
      enabled: body.enabled ?? true,
      createdAt: new Date().toISOString(),
    };

    channels.push(newChannel);

    await writeData(FILE_NAME, channels);

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error("Failed to create channel:", error);

    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}