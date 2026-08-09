import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Banquet, IPTVUser } from "@/lib/types";

const USERS_FILE = "iptv-users.json";
const BANQUET_FILE = "banquet.json";

export async function GET() {
  try {
    const users = await readData<IPTVUser[]>(USERS_FILE);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to read IPTV users:", error);

    return NextResponse.json(
      { error: "Failed to load IPTV users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const users = await readData<IPTVUser[]>(USERS_FILE);
    const banquets = await readData<Banquet[]>(BANQUET_FILE);

    /*
     * =====================================================
     * Validate Banquet
     * =====================================================
     */

    const banquetId = Number(body.banquetId);

    const banquetExists = banquets.some(
      (banquet) => banquet.id === banquetId
    );

    if (!banquetExists) {
      return NextResponse.json(
        { error: "Invalid banquetId" },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * Check Username
     * =====================================================
     */

    const usernameExists = users.some(
      (user) => user.username === body.username
    );

    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * Create User
     * =====================================================
     */

    const newUser: IPTVUser = {
      id:
        users.length > 0
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1,

      username: body.username,
      password: body.password,
      banquetId,

      enabled: body.enabled ?? true,

      expiresAt: body.expiresAt,

      maxConnections:
        Number(body.maxConnections) > 0
          ? Number(body.maxConnections)
          : 1,

      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    await writeData(USERS_FILE, users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Failed to create IPTV user:", error);

    return NextResponse.json(
      { error: "Failed to create IPTV user" },
      { status: 500 }
    );
  }
}