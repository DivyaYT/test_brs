import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error.",
        },
        { status: 500 },
      );
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or expired session.",
      },
      { status: 401 },
    );
  }
}
