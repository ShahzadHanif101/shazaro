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
// SHAZARO GET — AUTHENTICATION
// =====================================================

async function authenticateUser(
  username: string,
  password: string,
): Promise<IptvUser | null> {
  try {
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

    if (user.expiresAt) {
      const expiry = new Date(user.expiresAt);
      if (expiry.getTime() <= Date.now()) {
        return null;
      }
    }

    return user;
  } catch (error) {
    console.error("[SHAZARO GET] Auth error:", error);
    return null;
  }
}

// =====================================================
// SHAZARO GET — GENERATE M3U PLAYLIST
// =====================================================

function generateM3U(
  channels: Channel[],
  categories: Category[],
  banquet: Banquet,
  user: IptvUser,
  baseUrl: string,
): string {
  // Get enabled categories
  const enabledCategories = categories.filter(
    (category) => category.enabled,
  );
  const enabledCategoryIds = enabledCategories.map(
    (category) => category.id,
  );

  // Determine allowed categories
  let allowedCategoryIds: number[];
  if (banquet.access === "all") {
    allowedCategoryIds = enabledCategoryIds;
  } else {
    allowedCategoryIds = (banquet.allowedCategories ?? []).filter(
      (categoryId) => enabledCategoryIds.includes(categoryId),
    );
  }

  // Filter visible channels
  const visibleChannels = channels.filter(
    (channel) =>
      channel.enabled &&
      allowedCategoryIds.includes(channel.categoryId),
  );

  // Build M3U content
  let m3u = "#EXTM3U\n";
  
  // ✅ FIX: Only add expiry info if expiresAt exists
  if (user.expiresAt) {
    try {
      const expiry = new Date(user.expiresAt);
      // Check if date is valid
      if (!isNaN(expiry.getTime())) {
        const expTimestamp = Math.floor(expiry.getTime() / 1000);
        m3u += `# Expires: ${expiry.toISOString()} (${expTimestamp})\n`;
      }
    } catch (error) {
      console.warn("[SHAZARO GET] Invalid expiry date:", user.expiresAt);
    }
  }
  
  // Welcome stream
  m3u += `#EXTINF:-1 tvg-logo="" group-title="SHAZARO",SHAZARO Welcome\n`;
  m3u += `${baseUrl}/live/${user.username}/${user.password}/0.m3u8\n\n`;

  // Add each channel
  for (const channel of visibleChannels) {
    const category = categories.find(
      (cat) => cat.id === channel.categoryId,
    );
    const groupTitle = category?.name || "Uncategorized";

    m3u += `#EXTINF:-1 tvg-logo="${channel.logoUrl || ""}" group-title="${groupTitle}",${channel.name}\n`;
    m3u += `${baseUrl}/live/${user.username}/${user.password}/${channel.streamId}.m3u8\n`;
  }

  return m3u;
}

// =====================================================
// SHAZARO GET — MAIN ROUTE
// =====================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;

    const username = searchParams.get("username") ?? "";
    const password = searchParams.get("password") ?? "";
    const type = searchParams.get("type") ?? "";
    const streamId = Number(searchParams.get("stream") || searchParams.get("stream_id") || "0");

    // =====================================================
    // LOG THE REQUEST FOR DEBUGGING
    // =====================================================
    
    console.log(`[GET] Request: username=${username}, streamId=${streamId}, type=${type}`);

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!username || !password) {
      return new NextResponse(
        "Missing username or password",
        { status: 400 },
      );
    }

    // =====================================================
    // USER AUTHENTICATION
    // =====================================================

    const user = await authenticateUser(username, password);
    if (!user) {
      return new NextResponse("Invalid username or password", { status: 401 });
    }

    // =====================================================
    // LOAD DATA
    // =====================================================

    const [banquets, categories, channels] = await Promise.all([
      readData<Banquet[]>(BANQUET_FILE),
      readData<Category[]>(CATEGORY_FILE),
      readData<Channel[]>(CHANNEL_FILE),
    ]);

    const banquet = banquets.find((item) => item.id === user.banquetId);
    if (!banquet) {
      return new NextResponse("Banquet not found", { status: 403 });
    }

    // =====================================================
    // HANDLE M3U PLAYLIST
    // =====================================================

    if (type === "m3u" || type === "m3u_plus") {
      const baseUrl = `${url.protocol}//${url.host}`;
      const m3uContent = generateM3U(
        channels,
        categories,
        banquet,
        user,
        baseUrl,
      );

      return new NextResponse(m3uContent, {
        status: 200,
        headers: {
          "Content-Type": "application/x-mpegURL",
          "Content-Disposition": `attachment; filename="playlist_${username}.m3u"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // =====================================================
    // HANDLE EPG
    // =====================================================

    if (type === "epg") {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>\n<tv>\n  <!-- EPG data here -->\n</tv>`,
        {
          status: 200,
          headers: {
            "Content-Type": "application/xml",
          },
        },
      );
    }

    // =====================================================
    // HANDLE STREAM REQUEST
    // =====================================================

    if (streamId === 0) {
      return new NextResponse(
        "Please specify a valid stream ID",
        { status: 400 },
      );
    }

    // Find channel
    const channel = channels.find(
      (item) => item.streamId === streamId && item.enabled === true,
    );

    if (!channel) {
      return new NextResponse(
        `Channel with ID ${streamId} not found`,
        { status: 404 },
      );
    }

    // Check category
    const category = categories.find(
      (item) => item.id === channel.categoryId && item.enabled === true,
    );

    if (!category) {
      return new NextResponse(
        "Category unavailable",
        { status: 403 },
      );
    }

    // Check banquet access
    if (banquet.access === "selected") {
      const allowedCategories = banquet.allowedCategories ?? [];
      if (!allowedCategories.includes(category.id)) {
        return new NextResponse(
          "Stream not allowed",
          { status: 403 },
        );
      }
    }

    // =====================================================
    // REDIRECT TO ORIGINAL STREAM URL
    // =====================================================

    console.log(`[SHAZARO GET] ✅ Redirecting stream ${streamId} to: ${channel.streamUrl}`);

    return NextResponse.redirect(channel.streamUrl, 302);

  } catch (error) {
    console.error("[SHAZARO GET] Failed:", error);
    return new NextResponse(
      "Internal server error",
      { status: 500 },
    );
  }
}