import pool from "@/lib/db";
import { NextResponse } from "next/server";

/* ================= GET ================= */
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM so_customer_master ORDER BY customer_id DESC",
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ================= INSERT ================= */
export async function POST(req) {
  try {
    const data = await req.json();

    const result = await pool.query(
      `INSERT INTO so_customer_master
      (customer_code, customer_name, classification, status, mobile, email)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        data.customer_code,
        data.customer_name,
        data.classification,
        data.status,
        data.mobile,
        data.email,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ================= UPDATE ================= */
export async function PUT(req) {
  try {
    const data = await req.json();

    const result = await pool.query(
      `UPDATE so_customer_master SET
        customer_code=$1,
        customer_name=$2,
        classification=$3,
        status=$4,
        mobile=$5,
        email=$6
      WHERE customer_id=$7
      RETURNING *`,
      [
        data.customer_code,
        data.customer_name,
        data.classification,
        data.status,
        data.mobile,
        data.email,
        data.customer_id,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await pool.query("DELETE FROM so_customer_master WHERE customer_id=$1", [
      id,
    ]);

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
