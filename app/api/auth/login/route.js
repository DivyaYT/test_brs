// import pool from "@/lib/db";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const email = body.email?.trim().toLowerCase();
//     const password = body.password;

//     if (!email || !password) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Email and password are required.",
//         },
//         { status: 400 },
//       );
//     }

//     const jwtSecret = process.env.JWT_SECRET;

//     if (!jwtSecret) {
//       console.error("JWT_SECRET is missing in login API.");

//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "Server configuration error. Please contact the administrator.",
//         },
//         { status: 500 },
//       );
//     }

//     const result = await pool.query(
//       `SELECT
//          id,
//          name,
//          email,
//          password_hash,
//          role,
//          is_active
//        FROM users
//        WHERE email = $1
//        LIMIT 1`,
//       [email],
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid email or password.",
//         },
//         { status: 401 },
//       );
//     }

//     if (!user.is_active) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Your account is inactive. Please contact the administrator.",
//         },
//         { status: 403 },
//       );
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid email or password.",
//         },
//         { status: 401 },
//       );
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       jwtSecret,
//       {
//         expiresIn: "1d",
//       },
//     );

//     const response = NextResponse.json({
//       success: true,
//       message: "Login successful.",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60,
//     });

//     return response;
//   } catch (error) {
//     console.error("POST /api/auth/login error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Login failed. Please try again.",
//         details:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       },
//       { status: 500 },
//     );
//   }
// }



import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing in login API.");

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error. Please contact the administrator.",
        },
        { status: 500 },
      );
    }

    const result = await pool.query(
      `SELECT
         id,
         name,
         email,
         password_hash,
         role,
         is_active,
         organization_id
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "Your account is inactive. Please contact the administrator.",
        },
        { status: 403 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
      },
    });

    console.log("response", response);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Login failed. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
