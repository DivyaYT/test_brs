

import { NextResponse } from "next/server";
import pool from "@/lib/db";

/* =========================
   HELPERS
========================= */
const normalizeKey = (key) =>
  String(key ?? "")
    .trim()
    .toUpperCase();

const normalizeRow = (row) => {
  const normalized = {};

  Object.keys(row || {}).forEach((key) => {
    normalized[normalizeKey(key)] = row[key];
  });

  return normalized;
};

const getNullableValue = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  return value;
};

const getNumberOrNull = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const numberValue = Number(value);

  return isNaN(numberValue) ? null : numberValue;
};

/* =========================
   CREATE SINGLE RECORD
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `INSERT INTO GL_UPLOAD
      (MONTH, INVOICE_NUMBER, NAME, CMC_NO, CMC_NAME,
       ACCOUNTED_DR, ACCOUNTED_CR)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        getNullableValue(body.MONTH),
        getNullableValue(body.INVOICE_NUMBER),
        getNullableValue(body.NAME),
        getNullableValue(body.CMC_NO),
        getNullableValue(body.CMC_NAME),
        getNumberOrNull(body.ACCOUNTED_DR),
        getNumberOrNull(body.ACCOUNTED_CR),
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("POST ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Insert failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

/* =========================
   GET ALL RECORDS
========================= */
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM GL_UPLOAD ORDER BY GL_ID DESC`,
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Fetch failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

/* =========================
   UPDATE RECORD
========================= */
export async function PUT(req) {
  try {
    const body = await req.json();

    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "GL ID is required for update",
        },
        { status: 400 },
      );
    }

    const allowedColumns = [
      "MONTH",
      "INVOICE_NUMBER",
      "NAME",
      "CMC_NO",
      "CMC_NAME",
      "ACCOUNTED_DR",
      "ACCOUNTED_CR",
    ];

    const updateFields = Object.keys(fields).filter(
      (key) =>
        allowedColumns.includes(normalizeKey(key)) && fields[key] !== undefined,
    );

    if (updateFields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields provided for update",
        },
        { status: 400 },
      );
    }

    const setClause = updateFields
      .map((key, index) => `${normalizeKey(key)} = $${index + 1}`)
      .join(", ");

    const values = updateFields.map((key) => {
      const value = fields[key];

      if (
        normalizeKey(key) === "ACCOUNTED_DR" ||
        normalizeKey(key) === "ACCOUNTED_CR"
      ) {
        return getNumberOrNull(value);
      }

      return getNullableValue(value);
    });

    values.push(id);

    const result = await pool.query(
      `UPDATE GL_UPLOAD
       SET ${setClause}
       WHERE GL_ID = $${values.length}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Record not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Update failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

/* =========================
   DELETE SINGLE / BULK
========================= */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);

    const body = await req.json().catch(() => ({}));

    const { id, ids } = body;

    let recordIds = [];

    if (Array.isArray(ids)) {
      recordIds = ids;
    } else if (id !== undefined && id !== null) {
      recordIds = [id];
    } else {
      const queryId = searchParams.get("id");

      if (queryId) {
        recordIds = [queryId];
      }
    }

    if (recordIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide ID or IDs",
        },
        { status: 400 },
      );
    }

    const uniqueIds = [...new Set(recordIds.map(String))];

    const validIds = uniqueIds.every(
      (value) =>
        /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)),
    );

    if (!validIds) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid GL IDs",
        },
        { status: 400 },
      );
    }

    console.log("Deleting GL IDs:", uniqueIds);

    const result = await pool.query(
      `DELETE FROM GL_UPLOAD
       WHERE GL_ID = ANY($1::bigint[])
       RETURNING GL_ID`,
      [uniqueIds],
    );

    const deletedCount = result.rowCount;

    if (deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No matching records found",
          deletedCount: 0,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} records deleted successfully`,
      requestedCount: uniqueIds.length,
      deletedCount,
      deletedIds: result.rows.map((row) => row.gl_id),
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

/* =========================
   UPLOAD VALID ROWS
   Frontend sends:
   {
     type: "GL",
     rows: [ ...validRows ]
   }
========================= */
export async function PATCH(req) {
  try {
    const body = await req.json();

    const rows = body?.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid rows received",
        },
        { status: 400 },
      );
    }

    let insertedCount = 0;
    const failedRows = [];

    for (let index = 0; index < rows.length; index++) {
      const row = normalizeRow(rows[index]);

      try {
        const result = await pool.query(
          `INSERT INTO GL_UPLOAD
          (MONTH, INVOICE_NUMBER, NAME, CMC_NO, CMC_NAME,
           ACCOUNTED_DR, ACCOUNTED_CR)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING GL_ID`,
          [
            getNullableValue(row.MONTH),
            getNullableValue(row.INVOICE_NUMBER),
            getNullableValue(row.NAME),
            getNullableValue(row.CMC_NO),
            getNullableValue(row.CMC_NAME),
            getNumberOrNull(row.ACCOUNTED_DR),
            getNumberOrNull(row.ACCOUNTED_CR),
          ],
        );

        if (result.rowCount > 0) {
          insertedCount += 1;
        }
      } catch (rowError) {
        console.error(`Row ${index + 1} insert failed:`, rowError.message);

        failedRows.push({
          rowNumber: index + 1,
          error: rowError.message,
          row,
        });
      }
    }

    if (insertedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No rows were inserted",
          failedRows,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${insertedCount} valid rows uploaded successfully`,
      rowsUploaded: insertedCount,
      failedCount: failedRows.length,
      failedRows,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
