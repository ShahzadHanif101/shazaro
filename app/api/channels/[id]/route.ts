import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Channel } from "@/lib/types";

const FILE_NAME = "channels.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const channelId = Number(id);

    const body = await request.json();
    const channels = await readData<Channel[]>(FILE_NAME);

    const index = channels.findIndex(
      (channel) => channel.id === channelId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    const updatedChannel: Channel = {
      ...channels[index],
      name: body.name,
      stream_type: body.stream_type,
      streamUrl: body.streamUrl,
      logoUrl: body.logoUrl ?? "",
      categoryId: Number(body.categoryId),
      enabled: body.enabled ?? true,
    };

    channels[index] = updatedChannel;

    await writeData(FILE_NAME, channels);

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error("Failed to update channel:", error);

    return NextResponse.json(
      { error: "Failed to update channel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const channelId = Number(id);

    const channels = await readData<Channel[]>(FILE_NAME);

    const index = channels.findIndex(
      (channel) => channel.id === channelId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    channels.splice(index, 1);

    await writeData(FILE_NAME, channels);

    return NextResponse.json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete channel:", error);

    return NextResponse.json(
      { error: "Failed to delete channel" },
      { status: 500 }
    );
  }
}