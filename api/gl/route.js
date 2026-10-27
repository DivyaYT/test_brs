import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as XLSX from "xlsx";

// ================= CREATE =================
export async function POST(req) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.EFFECTIVE_DATE || !body.TRX_DATE || !body.SEGMENT1) {
      return NextResponse.json(
        { error: "EFFECTIVE_DATE, TRX_DATE, and SEGMENT1 are required" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `INSERT INTO GL_UPLOAD
      (EFFECTIVE_DATE, TRX_DATE, SEGMENT1, SEGMENT4,
       AE_HEADER_ID, AE_LINE_NUM, MONTH, INVOICE_NUMBER,
       DESCRIPTION, NAME, CMC_NAME, CMC_NO,
       CHECK_OR_DD_NUM, RECEIPT_METHOD, BANK_NAME,
       BANK_ACCOUNT_NUMBER, ACCOUNTED_DR, ACCOUNTED_CR,
       JE_CATEGORY, SOURCE)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
              $11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING *`,
      [
        body.EFFECTIVE_DATE,
        body.TRX_DATE,
        body.SEGMENT1,
        body.SEGMENT4 || null,
        body.AE_HEADER_ID || null,
        body.AE_LINE_NUM || null,
        body.MONTH || null,
        body.INVOICE_NUMBER || null,
        body.DESCRIPTION || null,
        body.NAME || null,
        body.CMC_NAME || null,
        body.CMC_NO || null,
        body.CHECK_OR_DD_NUM || null,
        body.RECEIPT_METHOD || null,
        body.BANK_NAME || null,
        body.BANK_ACCOUNT_NUMBER || null,
        body.ACCOUNTED_DR || 0,
        body.ACCOUNTED_CR || 0,
        body.JE_CATEGORY || null,
        body.SOURCE || null,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Insert failed" },
      { status: 500 },
    );
  }
}

// ================= GET =================
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM GL_UPLOAD ORDER BY GL_ID DESC`,
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Fetch failed" },
      { status: 500 },
    );
  }
}

// ================= UPDATE =================
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `UPDATE GL_UPLOAD SET
        EFFECTIVE_DATE=$1,
        TRX_DATE=$2,
        SEGMENT1=$3,
        SEGMENT4=$4,
        AE_HEADER_ID=$5,
        AE_LINE_NUM=$6,
        MONTH=$7,
        INVOICE_NUMBER=$8,
        DESCRIPTION=$9,
        NAME=$10,
        CMC_NAME=$11,
        CMC_NO=$12,
        CHECK_OR_DD_NUM=$13,
        RECEIPT_METHOD=$14,
        BANK_NAME=$15,
        BANK_ACCOUNT_NUMBER=$16,
        ACCOUNTED_DR=$17,
        ACCOUNTED_CR=$18,
        JE_CATEGORY=$19,
        SOURCE=$20
      WHERE GL_ID=$21
      RETURNING *`,
      [
        body.EFFECTIVE_DATE,
        body.TRX_DATE,
        body.SEGMENT1,
        body.SEGMENT4 || null,
        body.AE_HEADER_ID || null,
        body.AE_LINE_NUM || null,
        body.MONTH || null,
        body.INVOICE_NUMBER || null,
        body.DESCRIPTION || null,
        body.NAME || null,
        body.CMC_NAME || null,
        body.CMC_NO || null,
        body.CHECK_OR_DD_NUM || null,
        body.RECEIPT_METHOD || null,
        body.BANK_NAME || null,
        body.BANK_ACCOUNT_NUMBER || null,
        body.ACCOUNTED_DR || 0,
        body.ACCOUNTED_CR || 0,
        body.JE_CATEGORY || null,
        body.SOURCE || null,
        body.id,
      ],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Update failed" },
      { status: 500 },
    );
  }
}

// ================= DELETE =================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM GL_UPLOAD WHERE GL_ID=$1 RETURNING *`,
      [parseInt(id)],
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
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 },
    );
  }
}

// ================= EXCEL UPLOAD =================
export async function PATCH(req) {
  const client = await pool.connect();
  try {
    const arrayBuffer = await req.arrayBuffer();
    const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Excel is empty" }, { status: 400 });
    }

    await client.query("BEGIN");

    for (const row of rows) {
      await client.query(
        `INSERT INTO GL_UPLOAD
        (EFFECTIVE_DATE, TRX_DATE, SEGMENT1, SEGMENT4,
         AE_HEADER_ID, AE_LINE_NUM, MONTH, INVOICE_NUMBER,
         DESCRIPTION, NAME, CMC_NAME, CMC_NO,
         CHECK_OR_DD_NUM, RECEIPT_METHOD, BANK_NAME,
         BANK_ACCOUNT_NUMBER, ACCOUNTED_DR, ACCOUNTED_CR,
         JE_CATEGORY, SOURCE)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [
          row.EFFECTIVE_DATE || null,
          row.TRX_DATE || null,
          row.SEGMENT1 || null,
          row.SEGMENT4 || null,
          row.AE_HEADER_ID || null,
          row.AE_LINE_NUM || null,
          row.MONTH || null,
          row.INVOICE_NUMBER || null,
          row.DESCRIPTION || null,
          row.NAME || null,
          row.CMC_NAME || null,
          row.CMC_NO || null,
          row.CHECK_OR_DD_NUM || null,
          row.RECEIPT_METHOD || null,
          row.BANK_NAME || null,
          row.BANK_ACCOUNT_NUMBER || null,
          Number(row.ACCOUNTED_DR) || 0,
          Number(row.ACCOUNTED_CR) || 0,
          row.JE_CATEGORY || null,
          row.SOURCE || null,
        ],
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({
      message: "Excel uploaded successfully",
      rowsUploaded: rows.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PATCH ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
