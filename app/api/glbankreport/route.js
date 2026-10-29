import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = `
WITH
GL_SOURCE AS (
    SELECT
        G.*,
        CASE
            WHEN NULLIF(TRIM(G.MONTH::TEXT), '') IS NULL
                THEN NULL

            WHEN TRIM(G.MONTH::TEXT) ~ '^[0-9]+(\.[0-9]+)?$'
                THEN DATE '1899-12-30'
                     + TRUNC(G.MONTH::NUMERIC)::INTEGER

            WHEN TRIM(G.MONTH::TEXT) ~
                 '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                THEN LEFT(TRIM(G.MONTH::TEXT), 10)::DATE

            ELSE NULL
        END AS GL_CONVERTED_DATE

    FROM GL_UPLOAD G
),

BANK_SOURCE AS (
    SELECT
        B.*,
        CASE
            WHEN NULLIF(TRIM(B.TRANSFER_DATE::TEXT), '') IS NULL
                THEN NULL

            WHEN TRIM(B.TRANSFER_DATE::TEXT) ~
                 '^[0-9]+(\.[0-9]+)?$'
                THEN DATE '1899-12-30'
                     + TRUNC(B.TRANSFER_DATE::NUMERIC)::INTEGER

            WHEN TRIM(B.TRANSFER_DATE::TEXT) ~
                 '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                THEN LEFT(TRIM(B.TRANSFER_DATE::TEXT), 10)::DATE

            ELSE NULL
        END AS BANK_CONVERTED_DATE

    FROM BANK_STATEMANT B
),

GL AS (
    SELECT
        MAX(GL_ID) AS GL_ID,
        INVOICE_NUMBER,
        CMC_NAME,
        MAX(GL_CONVERTED_DATE) AS GL_DATE,

        SUM(COALESCE(ACCOUNTED_DR, 0)) AS GL_DEBIT,
        SUM(COALESCE(ACCOUNTED_CR, 0)) AS GL_CREDIT,

        MAX(STATUS) AS GL_STATUS

    FROM GL_SOURCE

    GROUP BY
        INVOICE_NUMBER,
        CMC_NAME
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
        G.GL_ID,
        G.INVOICE_NUMBER,
        G.CMC_NAME,
        G.GL_DATE,
        G.GL_DEBIT,
        G.GL_CREDIT,
        G.GL_STATUS,

        CASE
            WHEN G.GL_ID IS NOT NULL
            THEN ABS(
                COALESCE(G.GL_DEBIT, 0) -
                COALESCE(G.GL_CREDIT, 0)
            )
        END AS GL_DIFF,

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
                COALESCE(B.WITHDRAWALS, 0) -
                COALESCE(B.DEPOSITS, 0)
            )
        END AS BK_DIFF

    FROM GL G

    FULL OUTER JOIN BANK B
        ON UPPER(TRIM(G.CMC_NAME)) =
           UPPER(TRIM(B.TRANSFER_NAME))

       AND G.GL_DATE = B.TRANSFER_DATE
)

SELECT
    GL_ID,
    INVOICE_NUMBER,
    CMC_NAME,
    GL_DATE,
    GL_DEBIT,
    GL_CREDIT,
    GL_DIFF,
    GL_STATUS,

    BS_ID,
    TRANSFER_NAME,
    NEW_NAME,
    TRANSFER_DATE,
    DEPOSITS,
    WITHDRAWALS,
    BK_DIFF,
    BANK_STATUS,

    CASE
        WHEN GL_ID IS NOT NULL
         AND BS_ID IS NOT NULL
        THEN ABS(GL_DIFF - BK_DIFF)
        ELSE NULL
    END AS GL_BK_DIFF,

    CASE

        WHEN GL_ID IS NOT NULL
         AND BS_ID IS NOT NULL
         AND COALESCE(GL_DEBIT, 0) =
             COALESCE(DEPOSITS, 0)
         AND COALESCE(GL_CREDIT, 0) =
             COALESCE(WITHDRAWALS, 0)
        THEN 'GL & BANK MATCHED'

        WHEN GL_ID IS NOT NULL
         AND BS_ID IS NULL
        THEN 'GL ONLY'

        WHEN BS_ID IS NOT NULL
         AND GL_ID IS NULL
        THEN 'BANK ONLY'

        ELSE 'MISMATCHED'
    END AS STATUS

FROM BASE

ORDER BY
    TRANSFER_DATE DESC NULLS LAST,
    GL_DATE DESC NULLS LAST,
    INVOICE_NUMBER`;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
