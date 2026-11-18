import jwt from "jsonwebtoken";

export function getAuthUser(req) {
  const token = req?.cookies?.get?.("token")?.value || req?.cookies?.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    return {
      userId: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organization_id,
    };
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
}
