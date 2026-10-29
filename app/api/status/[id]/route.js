import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ================= GET BY ID =================
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const result = await pool.query(
      `SELECT * FROM status WHERE status_id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= UPDATE =================
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const result = await pool.query(
      `UPDATE status SET
        status_code  = $1,
        status_name  = $2,
        description  = $3,
        purpose      = $4,
        notes        = $5,
        color        = $6
      WHERE status_id = $7
      RETURNING *`,
      [
        body.statusCode ? Number(body.statusCode) : null,
        body.statusName || null,
        body.description || null,
        body.purpose || null,
        body.notes || null,
        body.color || null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const result = await pool.query(
      `DELETE FROM status WHERE status_id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
