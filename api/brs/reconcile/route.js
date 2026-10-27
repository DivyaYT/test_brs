import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ strict number conversion
const toNumber = (val) => {
  const num = Number(val);
  return Number.isInteger(num) ? num : null;
};

export async function PUT(req) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { matched, unmatched } = body;

    console.log("BODY:", body);

    await client.query("BEGIN");

    // ================= MATCHED =================

    // if (matched) {
    //   const name = matched.name;
    //   const invoice = matched.check_receipt_number || null;
    //   const trans_date = matched.transfer_date || null;
    //   const gl = matched.gl_diff ?? null;

    //   await client.query("BEGIN");

    //   try {
    //     // Generate ONE reconciliation ID
    //     const idResult = await client.query(
    //       `SELECT nextval('reconcile_id_seq') AS reconcile_id`,
    //     );

    //     const reconcileId = idResult.rows[0].reconcile_id;

    //     console.log("RECONCILE_ID:", reconcileId);

    //     // ================= AP UPDATE =================
    //     let res = await client.query(
    //       `UPDATE AP_UPLOAD
    //    SET STATUS = 'RECONCILED',
    //        RECONCILE_ID = $2
    //    WHERE CHECK_RECEIPT_NUMBER = $1`,
    //       [invoice, reconcileId],
    //     );

    //     console.log("AP matched updated:", res.rowCount);

    //     // ================= GL UPDATE =================
    //     res = await client.query(
    //       `UPDATE GL_UPLOAD
    //    SET STATUS = 'RECONCILED',
    //        RECONCILE_ID = $2
    //    WHERE INVOICE_NUMBER = $1`,
    //       [invoice, reconcileId],
    //     );

    //     console.log("GL matched updated:", res.rowCount);

    //     // ================= BANK UPDATE =================
    //     res = await client.query(
    //       `WITH cte AS (
    //      SELECT BS_ID
    //      FROM BANK_STATEMANT
    //      WHERE WITHDRAWALS = $1
    //         OR TRANSFER_DATE = $3
    //         OR TRIM(TRANSFER_NAME) ILIKE '%' || TRIM($2) || '%'
    //      ORDER BY BS_ID
    //      LIMIT 1
    //    )
    //    UPDATE BANK_STATEMANT b
    //    SET STATUS = 'RECONCILED',
    //        INVOICE_NUMBER = $4,
    //        TRANSFER_NAME = $2,
    //        RECONCILE_ID = $5
    //    FROM cte
    //    WHERE b.BS_ID = cte.BS_ID
    //    RETURNING b.*`,
    //       [gl, name, trans_date, invoice, reconcileId],
    //     );

    //     console.log("BANK matched updated:", res.rowCount);

    //     await client.query("COMMIT");
    //   } catch (error) {
    //     await client.query("ROLLBACK");
    //     throw error;
    //   }
    // }

    if (matched) {
      const name = matched.name?.trim() || null;
      const invoice = matched.check_receipt_number || null;
      const trans_date = matched.transfer_date || null;
      const gl = matched.gl_diff ?? null;

      await client.query("BEGIN");

      try {
        // Generate ONE reconciliation ID
        const idResult = await client.query(
          `SELECT nextval('reconcile_id_seq') AS reconcile_id`,
        );

        const reconcileId = idResult.rows[0].reconcile_id;

        console.log("RECONCILE_ID:", reconcileId);
        console.log("MATCHED DATA:", {
          invoice,
          name,
          trans_date,
          gl,
        });

        // ================= AP UPDATE =================
        let res = await client.query(
          `UPDATE AP_UPLOAD
       SET STATUS = 'RECONCILED',
           RECONCILE_ID = $2
       WHERE CHECK_RECEIPT_NUMBER = $1`,
          [invoice, reconcileId],
        );

        console.log("AP matched updated:", res.rowCount);

        // ================= GL UPDATE =================
        res = await client.query(
          `UPDATE GL_UPLOAD
       SET STATUS = 'RECONCILED',
           RECONCILE_ID = $2
       WHERE TRIM(INVOICE_NUMBER::text) = TRIM($1::text)`,
          [invoice, reconcileId],
        );

        console.log("GL matched updated:", res.rowCount);

        // ================= BANK UPDATE =================
        // Prefer the most reliable matching conditions.
        // Avoid OR conditions that can select an unrelated bank row.
        res = await client.query(
          `WITH cte AS (
         SELECT BS_ID
         FROM BANK_STATEMANT
         WHERE (
           $1::text IS NOT NULL
           AND TRIM(INVOICE_NUMBER::text) = TRIM($1::text)
         )
         OR (
           $1::text IS NULL
           AND $2::text IS NOT NULL
           AND $3::date IS NOT NULL
           AND TRIM(TRANSFER_NAME) ILIKE '%' || TRIM($2) || '%'
           AND TRANSFER_DATE::date = $3::date
           AND ABS(COALESCE(WITHDRAWALS, 0)) = ABS(COALESCE($4::numeric, 0))
         )
         ORDER BY BS_ID
         LIMIT 1
       )
       UPDATE BANK_STATEMANT b
       SET STATUS = 'RECONCILED',
           INVOICE_NUMBER = COALESCE($1, b.INVOICE_NUMBER),
           RECONCILE_ID = $5
       FROM cte
       WHERE b.BS_ID = cte.BS_ID
       RETURNING b.BS_ID, b.RECONCILE_ID, b.STATUS`,
          [invoice, name, trans_date, gl, reconcileId],
        );

        console.log("BANK matched updated:", res.rowCount);
        console.log("BANK updated records:", res.rows);

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Reconciliation error:", error);
        throw error;
      }
    }

    // ================= UNMATCHED =================
    if (unmatched) {
      const bs_id = toNumber(unmatched.bs_id);
      const invoice = unmatched.check_receipt_number || null;

      console.log("Unmatched ID:", bs_id);

      if (bs_id !== null) {
        const res = await client.query(
          `UPDATE BANK_STATEMANT 
             SET STATUS = 'RECONCILED',
                 INVOICE_NUMBER = $2
             WHERE BS_ID = $1`,
          [bs_id, invoice],
        );
        console.log("BANK unmatched updated:", res.rowCount);
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Reconciled successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
