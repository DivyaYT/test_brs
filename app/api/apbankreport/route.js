import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = `

WITH
AP_SOURCE AS (
    SELECT
        A.*,
        CASE
            WHEN NULLIF(TRIM(A.GL_DATE::TEXT), '') IS NULL
                THEN NULL

            WHEN TRIM(A.GL_DATE::TEXT) ~ '^[0-9]+(\.[0-9]+)?$'
                THEN DATE '1899-12-30'
                     + TRUNC(A.GL_DATE::NUMERIC)::INTEGER

            WHEN TRIM(A.GL_DATE::TEXT) ~
                 '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                THEN LEFT(TRIM(A.GL_DATE::TEXT), 10)::DATE

            ELSE NULL
        END AS AP_CONVERTED_DATE
    FROM AP_UPLOAD A
),

BANK_SOURCE AS (
    SELECT
        B.*,
        CASE
            WHEN NULLIF(TRIM(B.TRANSFER_DATE::TEXT), '') IS NULL
                THEN NULL

            WHEN TRIM(B.TRANSFER_DATE::TEXT) ~ '^[0-9]+(\.[0-9]+)?$'
                THEN DATE '1899-12-30'
                     + TRUNC(B.TRANSFER_DATE::NUMERIC)::INTEGER

            WHEN TRIM(B.TRANSFER_DATE::TEXT) ~
                 '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                THEN LEFT(TRIM(B.TRANSFER_DATE::TEXT), 10)::DATE

            ELSE NULL
        END AS BANK_CONVERTED_DATE
    FROM BANK_STATEMANT B
),

AP AS (
    SELECT
        MAX(AP_ID) AS AP_ID,
        CHECK_RECEIPT_NUMBER,
        MAX(AP_CONVERTED_DATE) AS AP_DATE,
        MAX(CMC_NO) AS CMC_NO,
        VENDOR_NAME,
        SUM(COALESCE(RECEIPTS, 0)) AS RECEIPTS,
        SUM(COALESCE(PAYMENTS, 0)) AS PAYMENTS,
        MAX(STATUS) AS AP_STATUS,
        RECONCILE_ID
    FROM AP_SOURCE
    GROUP BY
        CHECK_RECEIPT_NUMBER,
        VENDOR_NAME,
        RECONCILE_ID
),

BANK AS (
    SELECT
        MAX(BS_ID) AS BS_ID,
        TRANSFER_NAME,
        NEW_NAME,
        BANK_CONVERTED_DATE AS TRANSFER_DATE,
        SUM(COALESCE(DEPOSITS, 0)) AS DEPOSITS,
        SUM(COALESCE(WITHDRAWALS, 0)) AS WITHDRAWALS,
        MAX(STATUS) AS BANK_STATUS
    FROM BANK_SOURCE
    GROUP BY
        TRANSFER_NAME,
        NEW_NAME,
        BANK_CONVERTED_DATE
),

BASE AS (
    SELECT
        A.AP_ID,
        A.CHECK_RECEIPT_NUMBER,
        A.AP_DATE AS AP_GL_DATE,
        A.CMC_NO,
        A.VENDOR_NAME,
        A.RECEIPTS,
        A.PAYMENTS,
        A.AP_STATUS,
        A.RECONCILE_ID,

        CASE
            WHEN A.AP_ID IS NOT NULL
            THEN ABS(
                COALESCE(A.RECEIPTS, 0) -
                COALESCE(A.PAYMENTS, 0)
            )
        END AS AP_DIFF,

        B.BS_ID,
        B.TRANSFER_NAME,
        B.NEW_NAME,
        B.TRANSFER_DATE,
        B.DEPOSITS,
        B.WITHDRAWALS,
        B.BANK_STATUS,

        CASE
            WHEN B.BS_ID IS NOT NULL
            THEN ABS(
                COALESCE(B.DEPOSITS, 0) -
                COALESCE(B.WITHDRAWALS, 0)
            )
        END AS BK_DIFF

    FROM AP A
    FULL OUTER JOIN BANK B
        ON UPPER(TRIM(A.VENDOR_NAME)) =
           UPPER(TRIM(B.TRANSFER_NAME))
       AND A.AP_DATE = B.TRANSFER_DATE
)

SELECT
    AP_ID,
    CHECK_RECEIPT_NUMBER,
    AP_GL_DATE,
    CMC_NO,
    VENDOR_NAME,
    RECEIPTS,
    PAYMENTS,
    AP_DIFF,
    AP_STATUS,
    RECONCILE_ID,

    BS_ID,
    TRANSFER_NAME,
    NEW_NAME,
    TRANSFER_DATE,
    DEPOSITS,
    WITHDRAWALS,
    BK_DIFF,

    CASE
        WHEN AP_ID IS NOT NULL
         AND BS_ID IS NOT NULL
        THEN ABS(BK_DIFF - AP_DIFF)
        ELSE NULL
    END AS AP_BK_DIFF,

    BANK_STATUS,

    CASE
        WHEN AP_ID IS NOT NULL
         AND BS_ID IS NOT NULL
         AND COALESCE(RECEIPTS, 0) =
             COALESCE(DEPOSITS, 0)
         AND COALESCE(PAYMENTS, 0) =
             COALESCE(WITHDRAWALS, 0)
        THEN 'AP & BANK MATCHED'

        WHEN AP_ID IS NOT NULL
         AND BS_ID IS NULL
        THEN 'AP ONLY'

        WHEN BS_ID IS NOT NULL
         AND AP_ID IS NULL
        THEN 'BANK ONLY'

        ELSE 'MISMATCHED'
    END AS STATUS

FROM BASE

ORDER BY
    TRANSFER_DATE DESC NULLS LAST,
    RECONCILE_ID DESC NULLS LAST

`;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
