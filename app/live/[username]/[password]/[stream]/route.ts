import { NextResponse } from "next/server";
import { readData } from "@/lib/data";
import type {
  IptvUser,
  Banquet,
  Category,
  Channel,
} from "@/lib/types";

const USER_FILE = "iptv-users.json";
const BANQUET_FILE = "banquet.json";
const CATEGORY_FILE = "categories.json";
const CHANNEL_FILE = "channels.json";

// =====================================================
// SHAZARO LIVE ROUTE — AUTHENTICATION
// =====================================================

async function authenticateUser(
  username: string,
  password: string,
): Promise<IptvUser | null> {
  const users = await readData<IptvUser[]>(USER_FILE);

  const user = users.find(
    (item) =>
      item.username === username &&
      item.password === password &&
      item.enabled === true,
  );

  if (!user) {
    return null;
  }

  // =====================================================
  // SHAZARO LIVE ROUTE — EXPIRY CHECK
  // =====================================================

  if (user.expiresAt) {
    const expiry = new Date(user.expiresAt);

    if (expiry.getTime() <= Date.now()) {
      return null;
    }
  }

  return user;
}

// =====================================================
// SHAZARO LIVE ROUTE — STREAM REDIRECT
// =====================================================

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      username: string;
      password: string;
      stream: string;
    }>;
  },
) {
  try {
    const { username, password, stream } = await params;

    // =====================================================
    // SHAZARO LIVE ROUTE — STREAM ID
    // =====================================================

    const streamId = Number(
      stream.replace(/\.(m3u8|ts)$/, ""),
    );

    if (!username || !password || !streamId) {
      return new NextResponse(
        "Invalid request",
        { status: 400 },
      );
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — USER AUTHENTICATION
    // =====================================================

    const user = await authenticateUser(
      username,
      password,
    );

    if (!user) {
      return new NextResponse(
        "Invalid username or password",
        { status: 401 },
      );
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — LOAD DATA
    // =====================================================

    const banquets = await readData<Banquet[]>(
      BANQUET_FILE,
    );

    const categories = await readData<Category[]>(
      CATEGORY_FILE,
    );

    const channels = await readData<Channel[]>(
      CHANNEL_FILE,
    );

    // =====================================================
    // SHAZARO LIVE ROUTE — FIND BANQUET
    // =====================================================

    const banquet = banquets.find(
      (item) => item.id === user.banquetId,
    );

    if (!banquet) {
      return new NextResponse(
        "Banquet not found",
        { status: 403 },
      );
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — FIND CHANNEL
    // =====================================================

    const channel = channels.find(
      (item) =>
        item.streamId === streamId &&
        item.enabled === true,
    );

    if (!channel) {
      return new NextResponse(
        "Channel not found",
        { status: 404 },
      );
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — CATEGORY CHECK
    // =====================================================

    const category = categories.find(
      (item) =>
        item.id === channel.categoryId &&
        item.enabled === true,
    );

    if (!category) {
      return new NextResponse(
        "Category unavailable",
        { status: 403 },
      );
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — BANQUET ACCESS
    // =====================================================

    if (banquet.access === "selected") {
      const allowedCategories =
        banquet.allowedCategories ?? [];

      if (
        !allowedCategories.includes(category.id)
      ) {
        return new NextResponse(
          "Stream not allowed",
          { status: 403 },
        );
      }
    }

    // =====================================================
    // SHAZARO LIVE ROUTE — ORIGINAL STREAM REDIRECT
    // =====================================================

    return NextResponse.redirect(
      channel.streamUrl,
      302,
    );
  } catch (error) {
    console.error(
      "[SHAZARO LIVE ROUTE] Failed:",
      error,
    );

    return new NextResponse(
      "Internal server error",
      { status: 500 },
    );
  }
}