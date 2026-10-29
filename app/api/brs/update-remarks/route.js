import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req) {
  const client = await pool.connect();

  try {
    const { id, remarks } = await req.json();

    console.log("req", req); // ✅ removed stray `a`

    await client.query("BEGIN");

    if (!id || !remarks) {
      return NextResponse.json(
        { error: "Missing id or remarks" },
        { status: 400 },
      );
    }

    console.log("id", id);
    console.log("remarks", remarks);

    const result = await client.query(
      `UPDATE BANK_STATEMANT 
       SET REMARKS=$1
       WHERE BS_ID = $2 `,
      [remarks, id],
    );
    await client.query("COMMIT");

    return NextResponse.json({
      message: "Vendor updated",
      rows: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
