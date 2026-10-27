import pool from "@/lib/db";

export const runtime = "nodejs";

// GET ALL CUSTOMERS
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        customer_id,
        customer_name AS name,
        email,
        phone,
        status,
        created_at
      FROM customer_master
      ORDER BY customer_id DESC
    `);

    return Response.json(
      {
        success: true,
        data: result.rows,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Customers Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      { status: 500 },
    );
  }
}

// SAVE CUSTOMER
export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid customer data" },
        { status: 400 },
      );
    }

    const { name, email, phone } = body;
    const errors = {};

    if (typeof name !== "string" || name.trim().length < 3) {
      errors.name = "Name must contain at least 3 characters";
    } else if (name.trim().length > 150) {
      errors.name = "Name must not exceed 150 characters";
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      errors.email = "Enter a valid email address";
    } else if (email.trim().length > 255) {
      errors.email = "Email must not exceed 255 characters";
    }

    if (typeof phone !== "string" || !/^[0-9]{10}$/.test(phone.trim())) {
      errors.phone = "Phone number must contain exactly 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO customer_master (
        customer_name,
        email,
        phone
      )
      VALUES ($1, $2, $3)
      RETURNING
        customer_id,
        customer_name AS name,
        email,
        phone,
        status,
        created_at
    `;

    const values = [name.trim(), email.trim().toLowerCase(), phone.trim()];

    const result = await pool.query(query, values);

    return Response.json(
      {
        success: true,
        message: "Customer saved successfully",
        data: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.code === "23505") {
      return Response.json(
        {
          success: false,
          message: "Email already exists",
          errors: {
            email: "This email is already registered",
          },
        },
        { status: 409 },
      );
    }

    console.error("POST Customer Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to save customer",
      },
      { status: 500 },
    );
  }
}
