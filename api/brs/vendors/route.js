import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT DISTINCT vendor_name FROM ap_upload WHERE vendor_name IS NOT NULL ORDER BY vendor_name",
    );
    return Response.json(result.rows);
  } catch (err) {
    console.error("Vendors fetch error:", err);
    return Response.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
