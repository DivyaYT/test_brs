import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ================= CREATE =================
export async function POST(req) {
  try {
    const body = await req.json(); // ✅ frontend sends application/json
    console.log("body", body);
    const result = await pool.query(
      `INSERT INTO organization_master (
        org_code, short_name, org_name,
        effective_from, effective_to,
        industry, currency, status,
        landline_no, mobile_no, email, website,
        linkedin, twitter,
        address, country_id, state_id, city_id,
        bank_name, branch_name, ifsc_code, acc_no, acc_holder,
        noof_users, modules,
        reg_no, reg_place, pan_no, gstin,
        logo, logo_mime, logo_filename, logo_url,
        user_id, created_by, created_date
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27,$28,$29,$30,$31,$32,
        $33,$34,$35,NOW()
      )
      RETURNING *`,
      [
        body.orgCode || null,
        body.shortName || null,
        body.orgName || null,
        body.effectiveFrom || null,
        body.effectiveTo || null,
        body.industry || null,
        body.currency ? Number(body.currency) : null,
        body.status ? Number(body.status) : 0,
        body.landlineNo || null,
        body.mobileNo || null,
        body.email || null,
        body.website || null,
        body.linkedin || null,
        body.twitter || null,
        body.address || null,
        body.countryId ? Number(body.countryId) : null,
        body.stateId ? Number(body.stateId) : null,
        body.cityId ? Number(body.cityId) : null,
        body.bankName || null,
        body.branchName || null,
        body.ifscCode || null,
        body.accNo || null,
        body.accHolder || null,
        body.noofUsers ? Number(body.noofUsers) : 0,
        body.modules || null,
        body.regNo || null,
        body.regPlace || null,
        body.panNo || null,
        body.gstin || null,
        null, // logo — file uploads need multipart, send separately
        body.logoMime || null,
        body.logoFilename || null,
        body.logoUrl || null,
        body.userId ? Number(body.userId) : null,
        body.createdBy || null,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= GET =================
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM organization_master ORDER BY org_id DESC`,
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// // ================= UPDATE =================
// export async function PUT(req) {
//   try {
//     const body = await req.json();

//     const result = await pool.query(
//       `UPDATE organization_master
//        SET org_code=$1,
//            short_name=$2,
//            org_name=$3,
//            effective_from=$4,
//            effective_to=$5,
//            industry=$6,
//            currency=$7,
//            status=$8,
//            landline_no=$9,
//            mobile_no=$10,
//            email=$11,
//            website=$12,
//            linkedin=$13,
//            twitter=$14,
//            address=$15,
//            country_id=$16,
//            state_id=$17,
//            city_id=$18,
//            bank_name=$19,
//            branch_name=$20,
//            ifsc_code=$21,
//            acc_no=$22,
//            acc_holder=$23,
//            noof_users=$24,
//            modules=$25,
//            reg_no=$26,
//            reg_place=$27,
//            pan_no=$28,
//            gstin=$29,
//            logo=$30,
//            logo_mime=$31,
//            logo_filename=$32,
//            logo_url=$33,
//            user_id=$34,
//            updated_by=$35,
//            updated_date=NOW()
//        WHERE org_id=$36
//        RETURNING *`,
//       [
//         body.orgCode,
//         body.shortName,
//         body.orgName,
//         body.effectiveFrom,
//         body.effectiveTo,
//         body.industry,
//         body.currency,
//         body.status,
//         body.landlineNo,
//         body.mobileNo,
//         body.email,
//         body.website,
//         body.linkedin,
//         body.twitter,
//         body.address,
//         body.countryId,
//         body.stateId,
//         body.cityId,
//         body.bankName,
//         body.branchName,
//         body.ifscCode,
//         body.accNo,
//         body.accHolder,
//         body.noofUsers,
//         body.modules,
//         body.regNo,
//         body.regPlace,
//         body.panNo,
//         body.gstin,
//         body.logo,
//         body.logoMime,
//         body.logoFilename,
//         body.logoUrl,
//         body.userId,
//         body.updatedBy,
//         body.orgId,
//       ],
//     );

//     return NextResponse.json(result.rows[0]);
//   } catch (err) {
//     console.error("PUT ERROR:", err);
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

// // ================= DELETE =================
// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ error: "ID required" }, { status: 400 });
//     }

//     const result = await pool.query(
//       `DELETE FROM organization_master WHERE org_id=$1 RETURNING *`,
//       [id],
//     );

//     return NextResponse.json({
//       message: "Deleted successfully",
//       deleted: result.rows[0],
//     });
//   } catch (err) {
//     console.error("DELETE ERROR:", err);
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }

// // ================= EXCEL UPLOAD =================
// export async function PATCH(req) {
//   try {
//     const arrayBuffer = await req.arrayBuffer();

//     const workbook = XLSX.read(Buffer.from(arrayBuffer), {
//       type: "buffer",
//     });

//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = XLSX.utils.sheet_to_json(sheet);

//     for (const row of rows) {
//       await pool.query(
//         `INSERT INTO organization_master (
//           org_code, short_name, org_name,
//           mobile_no, email, address,
//           status, created_date
//         )
//         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
//         [
//           row.ORG_CODE,
//           row.SHORT_NAME,
//           row.ORG_NAME,
//           row.MOBILE_NO,
//           row.EMAIL,
//           row.ADDRESS,
//           row.STATUS || 1,
//         ],
//       );
//     }

//     return NextResponse.json({
//       message: "Excel uploaded",
//       rowsUploaded: rows.length,
//     });
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
