import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const role = body.role || "USER";
    const isActive = Boolean(body.is_active);

    if (!name || !phone) {
      return NextResponse.json(
        {
          error: "Name and phone are required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         phone = $2,
         role = $3,
         is_active = $4,
         updated_at = NOW()
       WHERE id = $5
       RETURNING
         id,
         name,
         email,
         role,
         phone,
         is_active,
         created_at,
         updated_at`,
      [name, phone, role, isActive, id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "User updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("PATCH /api/user/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update user.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id, name, email`,
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "User deleted successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE /api/user/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete user.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: 500,
      },
    );
  }
}
