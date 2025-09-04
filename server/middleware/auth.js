import jwt from "jsonwebtoken";

// Verify JWT from Authorization: cookie
export const requireAuth = (req, res, next) => {
  try {

    const cookieToken = req.cookies?.accessToken;
    console.log(cookieToken)
    if (!cookieToken) return res.status(401).json({ success: false, message: "Missing token" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: "JWT secret not configured" });

    const payload = jwt.verify(cookieToken, secret, { algorithms: ["HS256"]});
    console.log(payload);

    req.user = {
      id: payload.sub || payload.id,
      role: payload.role,
      username: payload.username,
    };

    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid/Expired token" });
  }
};

// Ensure the authenticated user has role=admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Not authorized" });
  next();
};

