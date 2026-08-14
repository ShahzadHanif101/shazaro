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
// SHAZARO XTREAM API — AUTHENTICATION
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

  if (user.expiresAt) {
    const expiry = new Date(user.expiresAt);
    if (expiry.getTime() <= Date.now()) {
      return null;
    }
  }

  return user;
}

// =====================================================
// SHAZARO XTREAM API — MAIN ROUTE
// =====================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;

    const username = searchParams.get("username") ?? "";
    const password = searchParams.get("password") ?? "";
    const action = searchParams.get("action");

    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json({
        user_info: {
          auth: 0,
          status: "Disabled",
          message: "Invalid username or password",
        },
        server_info: {},
      });
    }

    // =====================================================
    // LIVE CATEGORIES
    // =====================================================

    if (action === "get_live_categories") {
      const banquets = await readData<Banquet[]>(BANQUET_FILE);
      const categories = await readData<Category[]>(CATEGORY_FILE);

      const banquet = banquets.find(
        (item) => item.id === user.banquetId,
      );

      if (!banquet) {
        return NextResponse.json([]);
      }

      let visibleCategories: Category[];

      if (banquet.access === "all") {
        visibleCategories = categories.filter(
          (category) => category.enabled,
        );
      } else {
        const allowedCategories = banquet.allowedCategories ?? [];
        visibleCategories = categories.filter(
          (category) =>
            category.enabled &&
            allowedCategories.includes(category.id),
        );
      }

      return NextResponse.json(
        visibleCategories.map((category) => ({
          category_id: String(category.id),
          category_name: category.name,
          parent_id: 0,
        })),
      );
    }

    // =====================================================
    // LIVE STREAMS
    // =====================================================

    if (action === "get_live_streams") {
      const banquets = await readData<Banquet[]>(BANQUET_FILE);
      const categories = await readData<Category[]>(CATEGORY_FILE);
      const channels = await readData<Channel[]>(CHANNEL_FILE);

      const banquet = banquets.find(
        (item) => item.id === user.banquetId,
      );

      if (!banquet) {
        return NextResponse.json([]);
      }

      const enabledCategories = categories.filter(
        (category) => category.enabled,
      );
      const enabledCategoryIds = enabledCategories.map(
        (category) => category.id,
      );

      let allowedCategoryIds: number[];
      if (banquet.access === "all") {
        allowedCategoryIds = enabledCategoryIds;
      } else {
        allowedCategoryIds = (banquet.allowedCategories ?? []).filter(
          (categoryId) => enabledCategoryIds.includes(categoryId),
        );
      }

      const visibleChannels = channels.filter(
        (channel) =>
          channel.enabled &&
          allowedCategoryIds.includes(channel.categoryId),
      );

      const baseUrl = `${url.protocol}//${url.host}`;

      return NextResponse.json(
        visibleChannels.map((channel) => {
          const streamUrl = `${baseUrl}/live/${username}/${password}/${channel.streamId}.m3u8`;
          
          return {
            num: channel.id,
            name: channel.name,
            stream_type: "live",
            stream_id: channel.streamId,
            stream_icon: channel.logoUrl || "",
            epg_channel_id: "",
            added: Math.floor(
              new Date(channel.createdAt || Date.now()).getTime() / 1000,
            ),
            category_id: String(channel.categoryId),
            custom_sid: "",
            tv_archive: 0,
            direct_source: streamUrl,
            url: streamUrl,
          };
        }),
      );
    }

    // =====================================================
    // VOD & SERIES (Empty responses)
    // =====================================================

    if (
      action === "get_vod_categories" ||
      action === "get_vod_streams" ||
      action === "get_series_categories" ||
      action === "get_series"
    ) {
      return NextResponse.json([]);
    }

    // =====================================================
    // ✅ LOGIN RESPONSE WITH CORRECT EXPIRY FORMAT
    // =====================================================

    // ✅ Convert expiry to Unix timestamp (seconds)
    let expDate = null;
    if (user.expiresAt) {
      const expiry = new Date(user.expiresAt);
      expDate = Math.floor(expiry.getTime() / 1000); // Convert ms to seconds
    }

    return NextResponse.json({
      user_info: {
        username: user.username,
        password: user.password,
        message: "Welcome to SHAZARO",
        auth: 1,
        status: "Active",
        exp_date: expDate, // ✅ Unix timestamp (seconds)
        is_trial: "0",
        active_cons: "0",
        max_connections: String(user.maxConnections || 1),
      },
      server_info: {
        url: new URL(request.url).hostname,
        port: "80",
        https_port: "443",
        server_protocol: "http",
        timezone: "UTC",
      },
    });
  } catch (error) {
    console.error("[SHAZARO XTREAM API] Failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}