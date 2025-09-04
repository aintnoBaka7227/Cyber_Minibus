import jwt from "jsonwebtoken";

// Verify JWT from Authorization: Bearer <token>
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "Missing token" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: "JWT secret not configured" });

    const payload = jwt.verify(token, secret);
    req.user = payload; 
    console.log(payload); // test user detail paylog id, role
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Ensure the authenticated user has role=admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Not authorized" });
  next();
};

