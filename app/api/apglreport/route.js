import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = `
WITH
AP AS (
    SELECT
        MAX(AP_ID) AS AP_ID,
        CHECK_RECEIPT_NUMBER,
        MAX(GL_DATE) AS AP_DATE,
        MAX(CMC_NO) AS CMC_NO,
        VENDOR_NAME,
        SUM(COALESCE(RECEIPTS, 0)) AS RECEIPTS,
        SUM(COALESCE(PAYMENTS, 0)) AS PAYMENTS,
        MAX(STATUS) AS AP_STATUS,
        RECONCILE_ID
    FROM AP_UPLOAD
    GROUP BY
        CHECK_RECEIPT_NUMBER,
        VENDOR_NAME,
        RECONCILE_ID
),

GL AS (
    SELECT
        MAX(GL_ID) AS GL_ID,
        INVOICE_NUMBER,
        CMC_NAME,
        MAX(MONTH) AS GL_DATE,
        SUM(COALESCE(ACCOUNTED_DR, 0)) AS GL_DEBIT,
        SUM(COALESCE(ACCOUNTED_CR, 0)) AS GL_CREDIT,
        MAX(STATUS) AS GL_STATUS
    FROM GL_UPLOAD
    GROUP BY
        INVOICE_NUMBER,
        CMC_NAME
),

BASE AS (
    SELECT
        G.GL_ID,
        G.INVOICE_NUMBER,
        G.CMC_NAME,
        G.GL_DATE,
        G.GL_DEBIT,
        G.GL_CREDIT,
        G.GL_STATUS,

        ABS(
            COALESCE(G.GL_DEBIT, 0) -
            COALESCE(G.GL_CREDIT, 0)
        ) AS GL_DIFF,

        A.AP_ID,
        A.CHECK_RECEIPT_NUMBER,
        A.AP_DATE AS AP_GL_DATE,
        A.CMC_NO,
        A.VENDOR_NAME,
        A.RECEIPTS,
        A.PAYMENTS,
        A.AP_STATUS,
        A.RECONCILE_ID,

        ABS(
            COALESCE(A.RECEIPTS, 0) -
            COALESCE(A.PAYMENTS, 0)
        ) AS AP_DIFF

    FROM AP A
    FULL OUTER JOIN GL G
        ON TRIM(G.INVOICE_NUMBER) =
           TRIM(A.CHECK_RECEIPT_NUMBER)
)

SELECT
    AP_ID,
    CHECK_RECEIPT_NUMBER,
    AP_GL_DATE,
    CMC_NO,

    COALESCE(VENDOR_NAME, CMC_NAME) AS VENDOR_NAME,

    RECEIPTS,
    PAYMENTS,
    AP_DIFF,
    AP_STATUS,
    RECONCILE_ID,

    GL_ID,

    COALESCE(
        INVOICE_NUMBER,
        CHECK_RECEIPT_NUMBER
    ) AS INVOICE_NUMBER,

    GL_DATE,
    GL_DEBIT,
    GL_CREDIT,
    GL_DIFF,

    CASE
        WHEN AP_ID IS NOT NULL
         AND GL_ID IS NOT NULL
        THEN ABS(GL_DIFF - AP_DIFF)
        ELSE NULL
    END AS AP_GL_DIFF,

    GL_STATUS,

    CASE
        WHEN AP_ID IS NOT NULL
         AND GL_ID IS NULL
        THEN 'AP ONLY'

        WHEN GL_ID IS NOT NULL
         AND AP_ID IS NULL
        THEN 'GL ONLY'

        WHEN AP_ID IS NOT NULL
         AND GL_ID IS NOT NULL
         AND COALESCE(RECEIPTS, 0) = COALESCE(GL_DEBIT, 0)
         AND COALESCE(PAYMENTS, 0) = COALESCE(GL_CREDIT, 0)
        THEN 'AP & GL MATCHED'

        ELSE 'MISMATCHED'
    END AS STATUS

FROM BASE

ORDER BY
    AP_GL_DATE NULLS LAST,
    RECONCILE_ID DESC NULLS LAST

`;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
