import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createSession } from "@/lib/auth";

interface User {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // PRODUCTION: Use Vercel Environment Variables
    // =====================================================

    if (process.env.NODE_ENV === "production") {
      const adminUsername = process.env.SHAZARO_ADMIN_USERNAME;
      const adminPassword = process.env.SHAZARO_ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        console.error(
          "SHAZARO admin environment variables are not configured."
        );

        return NextResponse.json(
          {
            success: false,
            message: "Admin authentication is not configured.",
          },
          { status: 500 }
        );
      }

      if (
        username !== adminUsername ||
        password !== adminPassword
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid username or password.",
          },
          { status: 401 }
        );
      }

      await createSession(username);

      return NextResponse.json({
        success: true,
        message: "Login successful.",
        user: {
          username,
        },
      });
    }

    // =====================================================
    // DEVELOPMENT: Use data/users.json
    // =====================================================

    const filePath = path.join(
      process.cwd(),
      "data",
      "users.json"
    );

    const file = await fs.readFile(filePath, "utf-8");
    const users: User[] = JSON.parse(file);

    const user = users.find(
      (item) =>
        item.username === username &&
        item.password === password &&
        item.enabled === true
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    await createSession(user.username);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process login.",
      },
      { status: 500 }
    );
  }
}