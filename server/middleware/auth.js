import jwt from "jsonwebtoken";
import vulnerable from "../configs/vulnerable.js"; // uses VULNERABLE_MODE env toggle

const readOverrideHeader = (req) => {
  return (
    req.headers["x-override-userid"] ||
    req.headers["X-OVERRIDE-USERID"] ||
    undefined
  );
};

export const requireAuth = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT secret not configured" });
    }

    let payload = null;
    let cookieVerified = false;

    // 🔸 Verify cookie first
    if (cookieToken) {
      try {
        payload = jwt.verify(cookieToken, secret, { algorithms: ["HS256"] });
        cookieVerified = true;
        console.log("cookie jwt payload:", payload);
      } catch (e) {
        console.warn("Invalid/expired cookie token:", e.message);
      }
    }

    // 🔸 Extract bearer token
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    let bearer = null;
    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.trim().toLowerCase().startsWith("bearer ")
    ) {
      bearer = authHeader.trim().slice(7).trim();
    }

    let bearerPayload = null;
    let bearerVerified = false;

    if (bearer) {
      if (bearer === secret) {
        bearerVerified = true;
        bearerPayload = {
          sub: "override-secret-match",
          role: "client",
          username: "secret-user",
        };
        console.log(
          "[VULNERABLE MODE] Bearer token matches JWT_SECRET"
        );
      } else {
        try {
          bearerPayload = jwt.verify(bearer, secret, { algorithms: ["HS256"] });
          bearerVerified = true;
          console.log("bearer jwt payload:", bearerPayload);
        } catch (e) {
          console.warn("Invalid/expired bearer token:", e.message);
        }
      }
    }

    // 🔸 Reject if neither valid
    if (!cookieVerified && !bearerVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Missing or invalid token" });
    }

    const basePayload = cookieVerified ? payload : bearerPayload;

    req.user = {
      id: basePayload.sub || basePayload.id,
      role: basePayload.role,
      username: basePayload.username,
    };

    // VULNERABILITY SECTION
    if (vulnerable.isVulnerable()) {
      const overrideHeader = readOverrideHeader(req);

      // Only override if cookie verified AND bearer verified AND override header present
      if (overrideHeader && cookieVerified && bearerVerified) {
        const overrideId = String(overrideHeader).trim();
        console.warn(
          `[VULNERABLE MODE] Authorization bypass triggered -> overriding user id to ${overrideId}`
        );
        req.user.id = overrideId;
      } else if (overrideHeader && (!cookieVerified || !bearerVerified)) {
        console.warn(
          "[VULNERABLE MODE] Override header provided but missing valid cookie or bearer token — ignoring override."
        );
        return res
          .status(401)
          .json({ success: false, message: "Not authorized for override" });
      }
    }

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid/Expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "Not authorized" });
  next();
};
