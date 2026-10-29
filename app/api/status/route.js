import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ================= CREATE =================
export async function POST(req) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `INSERT INTO status (
        status_id,status_code, status_name, description, purpose, notes, color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        body.statusId ? Number(body.statusId) : null,
        body.statusCode ? Number(body.statusCode) : null,
        body.statusName || null,
        body.description || null,
        body.purpose || null,
        body.notes || null,
        body.color || null,
      ],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= GET ALL =================
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM status ORDER BY status_id DESC`,
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
