import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as XLSX from "xlsx";

// ================= CREATE =================
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body", body);
    // const result = await pool.query(
    //   `INSERT INTO BANK_STATEMANT
    //   (TRANSFER_DATE, INVOICE_NUMBER, TRANSFER_NAME, WITHDRAWALS, DEPOSITS, BALANCE)
    //   VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    //   [
    //     body.TRANSFER_DATE,
    //     body.INVOICE_NUMBER,
    //     body.TRANSFER_NAME,
    //     body.WITHDRAWALS,
    //     body.DEPOSITS,
    //     body.BALANCE,
    //   ],
    // );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}

// ================= GET =================
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM BANK_STATEMANT ORDER BY BS_ID DESC`,
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// ================= UPDATE =================
export async function PUT(req) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `UPDATE BANK_STATEMANT
       SET TRANSFER_DATE=$1,
           INVOICE_NUMBER=$2,
           TRANSFER_NAME=$3,
           WITHDRAWALS=$4,
           DEPOSITS=$5,
           BALANCE=$6
       WHERE BS_ID=$7
       RETURNING *`,
      [
        body.TRANSFER_DATE,
        body.INVOICE_NUMBER,
        body.TRANSFER_NAME,
        body.WITHDRAWALS,
        body.DEPOSITS,
        body.BALANCE,
        body.id,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ================= DELETE (FIXED) =================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("Deleting ID:", id); // ✅ DEBUG

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM BANK_STATEMANT WHERE BS_ID=$1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Deleted successfully",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// ================= EXCEL UPLOAD =================
export async function PATCH(req) {
  try {
    const arrayBuffer = await req.arrayBuffer();

    const workbook = XLSX.read(Buffer.from(arrayBuffer), {
      type: "buffer",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      await pool.query(
        `INSERT INTO BANK_STATEMANT 
        (TRANSFER_DATE, INVOICE_NUMBER, TRANSFER_NAME, WITHDRAWALS, DEPOSITS, BALANCE)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          row.TRANSFER_DATE,
          row.INVOICE_NUMBER,
          row.TRANSFER_NAME,
          row.WITHDRAWALS,
          row.DEPOSITS,
          row.BALANCE,
        ],
      );
    }

    return NextResponse.json({
      message: "Excel uploaded",
      rowsUploaded: rows.length,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
