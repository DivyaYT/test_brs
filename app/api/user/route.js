import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        role,
        phone,
        is_active,
        created_at,
        updated_at
      FROM users
      ORDER BY id DESC`,
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/user error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch users.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // console.log("body", body);
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role || "USER";
    const phone = body.phone?.trim();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        {
          error: "Name, email, password, and phone are required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
        (name, email, password_hash, role, phone, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING
        id,
        name,
        email,
        role,
        phone,
        is_active,
        created_at,
        updated_at`,
      [name, email, hashedPassword, role, phone],
    );

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/user error:", error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 },
      );
    }

    if (error.code === "23502") {
      return NextResponse.json(
        {
          error:
            "A required database field is missing. Check the users table structure.",
        },
        { status: 400 },
      );
    }

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "Database table 'users' does not exist." },
        { status: 500 },
      );
    }

    if (error.code === "42703") {
      return NextResponse.json(
        {
          error:
            "A database column is missing. Check that password_hash, role, phone, and is_active exist.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create user.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
