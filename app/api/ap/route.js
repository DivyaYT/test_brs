import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as XLSX from "xlsx";

// ================= CREATE =================
export async function POST(req) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `INSERT INTO AP_UPLOAD
      (ACCOUNTING_DATE, GL_DATE, VOUCHER_DATE, PERIOD_NAME, TYPE,
       VOUCHER_NO, CHECK_RECEIPT_NUMBER, VENDOR_NAME, CMC_NO,
       CHECK_OR_DD_NUM, DESCRIPTION, RECEIPTS, PAYMENTS,
       BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUM)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        body.ACCOUNTING_DATE,
        body.GL_DATE,
        body.VOUCHER_DATE,
        body.PERIOD_NAME,
        body.TYPE,
        body.VOUCHER_NO,
        body.CHECK_RECEIPT_NUMBER,
        body.VENDOR_NAME,
        body.CMC_NO,
        body.CHECK_OR_DD_NUM,
        body.DESCRIPTION,
        body.RECEIPTS,
        body.PAYMENTS,
        body.BANK_ACCOUNT_NAME,
        body.BANK_ACCOUNT_NUM,
      ],
    );

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
      `SELECT * FROM AP_UPLOAD ORDER BY AP_ID DESC`,
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
      `UPDATE AP_UPLOAD SET
        ACCOUNTING_DATE=$1,
        GL_DATE=$2,
        VOUCHER_DATE=$3,
        PERIOD_NAME=$4,
        TYPE=$5,
        VOUCHER_NO=$6,
        CHECK_RECEIPT_NUMBER=$7,
        VENDOR_NAME=$8,
        CMC_NO=$9,
        CHECK_OR_DD_NUM=$10,
        DESCRIPTION=$11,
        RECEIPTS=$12,
        PAYMENTS=$13,
        BANK_ACCOUNT_NAME=$14,
        BANK_ACCOUNT_NUM=$15
      WHERE AP_ID=$16
      RETURNING *`,
      [
        body.ACCOUNTING_DATE,
        body.GL_DATE,
        body.VOUCHER_DATE,
        body.PERIOD_NAME,
        body.TYPE,
        body.VOUCHER_NO,
        body.CHECK_RECEIPT_NUMBER,
        body.VENDOR_NAME,
        body.CMC_NO,
        body.CHECK_OR_DD_NUM,
        body.DESCRIPTION,
        body.RECEIPTS,
        body.PAYMENTS,
        body.BANK_ACCOUNT_NAME,
        body.BANK_ACCOUNT_NUM,
        body.id,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("Deleting AP ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM AP_UPLOAD WHERE AP_ID=$1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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
        `INSERT INTO AP_UPLOAD
        (ACCOUNTING_DATE, GL_DATE, VOUCHER_DATE, PERIOD_NAME, TYPE,
         VOUCHER_NO, CHECK_RECEIPT_NUMBER, VENDOR_NAME, CMC_NO,
         CHECK_OR_DD_NUM, DESCRIPTION, RECEIPTS, PAYMENTS,
         BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUM)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          row.ACCOUNTING_DATE,
          row.GL_DATE,
          row.VOUCHER_DATE,
          row.PERIOD_NAME,
          row.TYPE,
          row.VOUCHER_NO,
          row.CHECK_RECEIPT_NUMBER,
          row.VENDOR_NAME,
          row.CMC_NO,
          row.CHECK_OR_DD_NUM,
          row.DESCRIPTION,
          row.RECEIPTS,
          row.PAYMENTS,
          row.BANK_ACCOUNT_NAME,
          row.BANK_ACCOUNT_NUM,
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
