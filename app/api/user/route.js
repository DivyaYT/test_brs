import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Fetch users
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add user
export async function POST(req) {
  try {
    const { name, email } = await req.json();

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
