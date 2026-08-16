import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Banquet, IptvUser } from "@/lib/types";

const USERS_FILE = "iptv-users.json";
const BANQUET_FILE = "banquet.json";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/iptv-users/[id]
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const users = await readData<IptvUser[]>(USERS_FILE);

    const user = users.find(
      (item) => item.id === userId
    );

    if (!user) {
      return NextResponse.json(
        { error: "IPTV user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to read IPTV user:", error);

    return NextResponse.json(
      { error: "Failed to load IPTV user" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/iptv-users/[id]
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const users = await readData<IptvUser[]>(USERS_FILE);
    const banquets = await readData<Banquet[]>(BANQUET_FILE);

    const userIndex = users.findIndex(
      (item) => item.id === userId
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "IPTV user not found" },
        { status: 404 }
      );
    }

    const currentUser = users[userIndex];

    
    /*
     * =====================================================
     * Username
     * =====================================================
     */

    const username =
      body.username !== undefined
        ? String(body.username).trim()
        : currentUser.username;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const usernameExists = users.some(
      (user, index) =>
        index !== userIndex &&
        user.username === username
    );

    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * Password
     * =====================================================
     */

    const password =
      body.password !== undefined
        ? String(body.password)
        : currentUser.password;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * Banquet
     * =====================================================
     */

    let updatedBanquetId = currentUser.banquetId;

    if (body.banquetId !== undefined) {
      const requestedBanquetId = Number(body.banquetId);

      if (!Number.isInteger(requestedBanquetId)) {
        return NextResponse.json(
          { error: "Invalid banquetId" },
          { status: 400 }
        );
      }

      const banquetExists = banquets.some(
        (banquet) =>
          banquet.id === requestedBanquetId
      );

      if (!banquetExists) {
        return NextResponse.json(
          { error: "Invalid banquetId" },
          { status: 400 }
        );
      }

      updatedBanquetId = requestedBanquetId;
    }

    /*
     * =====================================================
     * Enabled
     * =====================================================
     */

    const updatedEnabled =
      body.enabled !== undefined
        ? Boolean(body.enabled)
        : currentUser.enabled;

    /*
     * =====================================================
     * Expiry
     * =====================================================
     */

    const updatedExpiresAt =
      body.expiresAt !== undefined
        ? body.expiresAt
        : currentUser.expiresAt;

    /*
     * =====================================================
     * Max Connections
     * =====================================================
     */

    let updatedMaxConnections =
      currentUser.maxConnections;

    if (body.maxConnections !== undefined) {
      const requestedMaxConnections =
        Number(body.maxConnections);

      if (
        !Number.isInteger(requestedMaxConnections) ||
        requestedMaxConnections < 1
      ) {
        return NextResponse.json(
          {
            error:
              "Max connections must be at least 1",
          },
          { status: 400 }
        );
      }

      updatedMaxConnections =
        requestedMaxConnections;
    }

    /*
     * =====================================================
     * Update User
     * =====================================================
     */

    const updatedUser: IptvUser = {
      ...currentUser,

      username,
      password,
      banquetId: updatedBanquetId,
      enabled: updatedEnabled,
      expiresAt: updatedExpiresAt,
      maxConnections: updatedMaxConnections,
    };

    users[userIndex] = updatedUser;

    await writeData(USERS_FILE, users);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(
      "Failed to update IPTV user:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update IPTV user" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const users = await readData<IptvUser[]>(USERS_FILE);

    const userIndex = users.findIndex(
      (user) => user.id === userId
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "IPTV user not found" },
        { status: 404 }
      );
    }

    const deletedUser = users[userIndex];

    users.splice(userIndex, 1);

    await writeData(USERS_FILE, users);

    return NextResponse.json({
      success: true,
      message: "IPTV user deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(
      "Failed to delete IPTV user:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete IPTV user" },
      { status: 500 }
    );
  }
}