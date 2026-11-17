import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = `
WITH
/* 1. Normalize AP dates */
ap_source AS (
    SELECT
        t.*,
        CASE
            WHEN NULLIF(BTRIM(t.gl_date::text), '') IS NULL
                THEN NULL::date

            WHEN BTRIM(t.gl_date::text)
                 ~ '^[0-9]+([.][0-9]+)?$'
                THEN DATE '1899-12-30'
                     + FLOOR(
                         BTRIM(t.gl_date::text)::numeric
                       )::integer

            WHEN BTRIM(t.gl_date::text)
                 ~ '^[0-9]{2}-[A-Za-z]{3}-[0-9]{4}$'
                THEN TO_DATE(
                    BTRIM(t.gl_date::text),
                    'DD-MON-YYYY'
                )

            ELSE BTRIM(t.gl_date::text)::date
        END AS parsed_ap_date
    FROM ap_upload t
),

/* 2. Normalize GL dates */
gl_source AS (
    SELECT
        t.*,
        CASE
            WHEN NULLIF(BTRIM(t.month::text), '') IS NULL
                THEN NULL::date

            WHEN BTRIM(t.month::text)
                 ~ '^[0-9]+([.][0-9]+)?$'
                THEN DATE '1899-12-30'
                     + FLOOR(
                         BTRIM(t.month::text)::numeric
                       )::integer

            WHEN BTRIM(t.month::text)
                 ~ '^[0-9]{2}-[A-Za-z]{3}-[0-9]{4}$'
                THEN TO_DATE(
                    BTRIM(t.month::text),
                    'DD-MON-YYYY'
                )

            ELSE BTRIM(t.month::text)::date
        END AS parsed_gl_date
    FROM gl_upload t
),

/* 3. Normalize bank dates */
bank_source AS (
    SELECT
        t.*,
        CASE
            WHEN NULLIF(BTRIM(t.transfer_date::text), '') IS NULL
                THEN NULL::date

            WHEN BTRIM(t.transfer_date::text)
                 ~ '^[0-9]+([.][0-9]+)?$'
                THEN DATE '1899-12-30'
                     + FLOOR(
                         BTRIM(t.transfer_date::text)::numeric
                       )::integer

            WHEN BTRIM(t.transfer_date::text)
                 ~ '^[0-9]{2}-[A-Za-z]{3}-[0-9]{4}$'
                THEN TO_DATE(
                    BTRIM(t.transfer_date::text),
                    'DD-MON-YYYY'
                )

            ELSE BTRIM(t.transfer_date::text)::date
        END AS parsed_bank_date
    FROM bank_statemant t
),

/* 4. Aggregate AP by receipt number and vendor */
ap AS (
    SELECT
        MAX(ap_id) AS ap_id,

        NULLIF(
            BTRIM(check_receipt_number::text),
            ''
        ) AS reference_key,

        NULLIF(
            UPPER(BTRIM(vendor_name::text)),
            ''
        ) AS name_key,

        MAX(check_receipt_number) AS check_receipt_number,
        MAX(parsed_ap_date) AS ap_date,
        MAX(cmc_no) AS cmc_no,
        MAX(vendor_name) AS vendor_name,

        SUM(COALESCE(receipts, 0)) AS receipts,
        SUM(COALESCE(payments, 0)) AS payments,

        BOOL_OR(
            COALESCE(
                UPPER(BTRIM(status::text)) = 'RECONCILED',
                FALSE
            )
        ) AS ap_has_reconciled,

        STRING_AGG(
            DISTINCT status::text,
            ', ' ORDER BY status::text
        ) AS ap_status,

        STRING_AGG(
            DISTINCT reconcile_id::text,
            ', ' ORDER BY reconcile_id::text
        ) AS reconcile_ids,

        COUNT(*) AS ap_row_count,
        COUNT(DISTINCT parsed_ap_date) AS ap_date_count

    FROM ap_source

    GROUP BY
        NULLIF(BTRIM(check_receipt_number::text), ''),
        NULLIF(UPPER(BTRIM(vendor_name::text)), '')
),

/* 5. Aggregate GL by invoice number and CMC name */
gl AS (
    SELECT
        MAX(gl_id) AS gl_id,

        NULLIF(
            BTRIM(invoice_number::text),
            ''
        ) AS reference_key,

        NULLIF(
            UPPER(BTRIM(cmc_name::text)),
            ''
        ) AS name_key,

        MAX(invoice_number) AS invoice_number,
        MAX(cmc_name) AS cmc_name,
        MAX(parsed_gl_date) AS gl_date,

        SUM(COALESCE(accounted_dr, 0)) AS gl_debit,
        SUM(COALESCE(accounted_cr, 0)) AS gl_credit,

        BOOL_OR(
            COALESCE(
                UPPER(BTRIM(status::text)) = 'RECONCILED',
                FALSE
            )
        ) AS gl_has_reconciled,

        STRING_AGG(
            DISTINCT status::text,
            ', ' ORDER BY status::text
        ) AS gl_status,

        COUNT(*) AS gl_row_count,
        COUNT(DISTINCT parsed_gl_date) AS gl_date_count

    FROM gl_source

    GROUP BY
        NULLIF(BTRIM(invoice_number::text), ''),
        NULLIF(UPPER(BTRIM(cmc_name::text)), '')
),

/* 6. Aggregate bank by transfer name and date */
bank AS (
    SELECT
        MAX(bs_id) AS bs_id,

        NULLIF(
            UPPER(BTRIM(transfer_name::text)),
            ''
        ) AS name_key,

        MAX(transfer_name) AS transfer_name,

        STRING_AGG(
            DISTINCT new_name::text,
            ', ' ORDER BY new_name::text
        ) AS new_name,

        parsed_bank_date AS transfer_date,

        SUM(COALESCE(deposits, 0)) AS deposits,
        SUM(COALESCE(withdrawals, 0)) AS withdrawals,

        BOOL_OR(
            COALESCE(
                UPPER(BTRIM(status::text)) = 'RECONCILED',
                FALSE
            )
        ) AS bank_has_reconciled,

        STRING_AGG(
            DISTINCT status::text,
            ', ' ORDER BY status::text
        ) AS bank_status,

        COUNT(*) AS bank_row_count

    FROM bank_source

    GROUP BY
        NULLIF(UPPER(BTRIM(transfer_name::text)), ''),
        parsed_bank_date
),

/* 7. Join AP, GL and bank */
base AS (
    SELECT
        a.ap_id,
        a.check_receipt_number,
        a.ap_date AS ap_gl_date,
        a.cmc_no,
        a.vendor_name,
        a.receipts,
        a.payments,
        a.ap_status,
        a.reconcile_ids,
        a.ap_has_reconciled,
        a.ap_row_count,
        a.ap_date_count,

        CASE
            WHEN a.ap_id IS NOT NULL
                THEN ABS(a.receipts - a.payments)
        END AS ap_diff,

        g.gl_id,
        g.invoice_number,
        g.cmc_name,
        g.gl_date,
        g.gl_debit,
        g.gl_credit,
        g.gl_status,
        g.gl_has_reconciled,
        g.gl_row_count,
        g.gl_date_count,

        CASE
            WHEN g.gl_id IS NOT NULL
                THEN ABS(g.gl_debit - g.gl_credit)
        END AS gl_diff,

        b.bs_id,
        b.transfer_name,
        b.new_name,
        b.transfer_date,
        b.deposits,
        b.withdrawals,
        b.bank_status,
        b.bank_has_reconciled,
        b.bank_row_count,

        CASE
            WHEN b.bs_id IS NOT NULL
                THEN ABS(b.withdrawals - b.deposits)
        END AS bk_diff

    FROM ap a

    FULL OUTER JOIN gl g
        ON g.reference_key = a.reference_key
       AND g.name_key = a.name_key

    FULL OUTER JOIN bank b
        ON b.transfer_date = COALESCE(g.gl_date, a.ap_date)
       AND (
            b.name_key = g.name_key
            OR b.name_key = a.name_key
       )
),

/* 8. Calculate match status and saved reconciliation flag */
classified AS (
    SELECT
        base.*,

        CASE
            WHEN ap_id IS NOT NULL
             AND gl_id IS NOT NULL
             AND bs_id IS NOT NULL
             AND ap_diff = gl_diff
             AND gl_diff = bk_diff
                THEN 'FULLY MATCHED'

            WHEN ap_id IS NOT NULL
             AND gl_id IS NOT NULL
             AND ap_diff = gl_diff
                THEN 'AP & GL MATCHED'

            WHEN ap_id IS NOT NULL
             AND bs_id IS NOT NULL
             AND ap_diff = bk_diff
                THEN 'AP & BANK MATCHED'

            WHEN gl_id IS NOT NULL
             AND bs_id IS NOT NULL
             AND gl_diff = bk_diff
                THEN 'GL & BANK MATCHED'

            WHEN ap_id IS NOT NULL
             AND gl_id IS NULL
             AND bs_id IS NULL
                THEN 'AP ONLY'

            WHEN gl_id IS NOT NULL
             AND ap_id IS NULL
             AND bs_id IS NULL
                THEN 'GL ONLY'

            WHEN bs_id IS NOT NULL
             AND ap_id IS NULL
             AND gl_id IS NULL
                THEN 'BANK ONLY'

            ELSE 'MISMATCHED'
        END AS match_status,

        (
            COALESCE(ap_has_reconciled, FALSE)
            OR COALESCE(gl_has_reconciled, FALSE)
            OR COALESCE(bank_has_reconciled, FALSE)
        ) AS any_source_reconciled

    FROM base
)

/* 9. Format dates only in the final output */
SELECT
    c.ap_id,
    c.check_receipt_number,
    TO_CHAR(c.ap_gl_date, 'DD-Mon-YYYY') AS ap_gl_date,
    c.cmc_no,
    COALESCE(c.vendor_name, c.cmc_name) AS vendor_name,
    c.receipts,
    c.payments,
    c.ap_diff,
    c.ap_status,
    c.reconcile_ids,

    c.gl_id,
    COALESCE(
        c.invoice_number,
        c.check_receipt_number
    ) AS invoice_number,
    c.cmc_name,
    TO_CHAR(c.gl_date, 'DD-Mon-YYYY') AS gl_date,
    c.gl_debit,
    c.gl_credit,
    c.gl_diff,
    ABS(c.gl_diff - c.ap_diff) AS ap_gl_diff,
    c.gl_status,

    c.bs_id,
    c.transfer_name,
    c.new_name,
    TO_CHAR(c.transfer_date, 'DD-Mon-YYYY') AS transfer_date,
    c.deposits,
    c.withdrawals,
    c.bk_diff,
    ABS(c.bk_diff - c.gl_diff) AS gl_bk_diff,
    ABS(c.bk_diff - c.ap_diff) AS ap_bk_diff,
    c.bank_status,

    c.ap_row_count,
    c.gl_row_count,
    c.bank_row_count,
    c.ap_date_count,
    c.gl_date_count,

    c.match_status,
    c.any_source_reconciled,

    CASE
        WHEN c.match_status = 'FULLY MATCHED'
            THEN 'FULLY MATCHED'

        WHEN c.any_source_reconciled
            THEN 'RECONCILED'

        ELSE c.match_status
    END AS status

FROM classified c

ORDER BY
    COALESCE(
        c.transfer_date,
        c.gl_date,
        c.ap_gl_date
    ) DESC NULLS LAST,
    COALESCE(c.invoice_number, c.check_receipt_number)
`;

    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}

// WITH
//     AP AS (
//         SELECT
//             MAX(AP_ID) AS AP_ID, CHECK_RECEIPT_NUMBER, MAX(GL_DATE) AS AP_DATE, MAX(CMC_NO) AS CMC_NO,  VENDOR_NAME,
//             SUM(COALESCE(RECEIPTS, 0)) AS RECEIPTS, SUM(COALESCE(PAYMENTS, 0)) AS PAYMENTS,  MAX(STATUS) AS AP_STATUS,RECONCILE_ID
//         FROM AP_UPLOAD
//         GROUP BY CHECK_RECEIPT_NUMBER,VENDOR_NAME,RECONCILE_ID),

//     GL AS (
//         SELECT
//             MAX(GL_ID) AS GL_ID,
//             INVOICE_NUMBER, CMC_NAME, MAX(MONTH) AS GL_DATE, SUM(COALESCE(ACCOUNTED_DR, 0)) AS GL_DEBIT,
//             SUM(COALESCE(ACCOUNTED_CR, 0)) AS GL_CREDIT, MAX(STATUS) AS GL_STATUS
//         FROM GL_UPLOAD
//         GROUP BY INVOICE_NUMBER, CMC_NAME),

//     BANK AS (
//         SELECT
//             MAX(BS_ID) AS BS_ID, TRANSFER_NAME, NEW_NAME, TRANSFER_DATE, SUM(COALESCE(DEPOSITS, 0)) AS DEPOSITS ,SUM(COALESCE(WITHDRAWALS, 0)) AS WITHDRAWALS ,
//             STATUS AS BANK_STATUS
//         FROM BANK_STATEMANT GROUP BY TRANSFER_NAME, TRANSFER_NAME, NEW_NAME, TRANSFER_DATE,STATUS),

//     BASE AS (
//         SELECT
//             G.GL_ID,
//             G.INVOICE_NUMBER,
//             G.CMC_NAME,
//             G.GL_DATE,
//             G.GL_DEBIT,
//             G.GL_CREDIT,
//             G.GL_STATUS,
//             ABS( COALESCE(G.GL_DEBIT , 0) - COALESCE(G.GL_CREDIT, 0)) AS GL_DIFF,

//             A.AP_ID,
//             A.CHECK_RECEIPT_NUMBER,
//             A.AP_DATE AS AP_GL_DATE,
//             A.CMC_NO,
//             A.VENDOR_NAME,
//             A.RECEIPTS,
//             A.PAYMENTS,
//             A.AP_STATUS,
//             ABS( COALESCE(A.RECEIPTS, 0) - COALESCE(A.PAYMENTS, 0)) AS AP_DIFF,A.RECONCILE_ID,

//             B.BS_ID,
//             B.TRANSFER_NAME,
//             B.NEW_NAME,
//             B.TRANSFER_DATE,
//             B.DEPOSITS,
//             B.WITHDRAWALS,
//             B.BANK_STATUS,
//             ABS( COALESCE(B.WITHDRAWALS, 0) - COALESCE(B.DEPOSITS, 0)) AS BK_DIFF

//         FROM AP A
//         FULL OUTER JOIN GL G
//             ON G.INVOICE_NUMBER = A.CHECK_RECEIPT_NUMBER
//         FULL OUTER JOIN BANK B
//             ON (B.TRANSFER_DATE = G.GL_DATE )
//             --OR B.TRANSFER_DATE = A.AP_DATE)

//         AND (B.TRANSFER_NAME = G.CMC_NAME
//             OR B.TRANSFER_NAME = A.VENDOR_NAME))

//     SELECT

//         AP_ID, CHECK_RECEIPT_NUMBER, AP_GL_DATE, CMC_NO, COALESCE(VENDOR_NAME, CMC_NAME) AS VENDOR_NAME, RECEIPTS, PAYMENTS, AP_DIFF, AP_STATUS,RECONCILE_ID,

//         GL_ID, COALESCE(INVOICE_NUMBER, CHECK_RECEIPT_NUMBER) AS INVOICE_NUMBER, GL_DATE, GL_DEBIT, GL_CREDIT, GL_DIFF, ABS(GL_DIFF - AP_DIFF) AS AP_GL_DIFF, GL_STATUS,

//         BS_ID, TRANSFER_NAME, NEW_NAME, TRANSFER_DATE, DEPOSITS, WITHDRAWALS, BK_DIFF, ABS(BK_DIFF - GL_DIFF) AS GL_BK_DIFF, BANK_STATUS,

//     CASE
//         WHEN AP_ID IS NOT NULL AND GL_ID IS NOT NULL AND BS_ID IS NOT NULL
// 		AND AP_DIFF = GL_DIFF AND GL_DIFF = BK_DIFF
//         THEN 'FULLY MATCHED'

//         WHEN AP_STATUS = 'RECONCILED' OR GL_STATUS = 'RECONCILED' OR BANK_STATUS = 'RECONCILED'
//         THEN 'RECONCILED'

//       	WHEN  ( AP_DIFF = GL_DIFF AND  AP_DIFF >0 AND GL_DIFF>0)  THEN 'AP & GL MATCHED'

//       	WHEN  (AP_DIFF = BK_DIFF  AND  AP_DIFF >0 AND BK_DIFF>0)  THEN 'AP & BANK MATCHED'

//       	WHEN  (GL_DIFF = BK_DIFF  AND  BK_DIFF >0 AND GL_DIFF>0)  THEN 'GL & BANK MATCHED'

//         WHEN AP_ID IS NOT NULL AND GL_ID IS NULL AND BS_ID IS NULL THEN 'AP ONLY'
//         WHEN GL_ID IS NOT NULL AND AP_ID IS NULL AND BS_ID IS NULL THEN 'GL ONLY'
//         WHEN BS_ID IS NOT NULL AND AP_ID IS NULL AND GL_ID IS NULL THEN 'BANK ONLY'

//         WHEN (GL_DEBIT != WITHDRAWALS )
//         OR (AP_ID IS  NULL AND GL_ID IS  NULL AND BS_ID IS  NOT NULL)
//         THEN 'MISMATCHED'

//         ELSE 'MISMATCHED'
//     END AS STATUS

// FROM BASE

// ORDER BY TRANSFER_DATE,RECONCILE_ID DESC
