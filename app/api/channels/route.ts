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

    const newId =
      channels.length > 0
        ? Math.max(...channels.map((channel) => channel.id)) + 1
        : 1;

    const newStreamId =
      channels.length > 0
        ? Math.max(...channels.map((channel) => channel.streamId)) + 1
        : 1001;

    const newChannel: Channel = {
      id: newId,
      name: body.name,
      streamId: newStreamId,
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