import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import vulnerable from "../configs/vulnerable.js";

const cookieOpts = {
  httpOnly: false,
  secure: false,
  sameSite: "Lax",
  path:"/"
};

export const register = async (req, res) => {
  try {
    const { email, username, password, role} = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "username, email and password are required" });
    }

    const exist = await User.findOne({ $or: [{ email }, { username }] });
    if (exist) return res.status(409).json({ success: false, message: "User already exists" });

    const new_user = await User.create({ username, email, password, role });

    const token = signToken(new_user)

    res
      .cookie("accessToken", token, cookieOpts)
      .status(201)
      .json({
        user: { id: new_user._id, username: new_user.username, email: new_user.email, role: new_user.role },
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // CTF mode: intentionally vulnerable login injections
    // (toggle via VULNERABLE_SQLI_MODE=true)
    // This branch demonstrates three classic NoSQL-injection patterns that
    // can bypass authentication when inputs are used unsafely in queries.
    // Example payloads (JSON):
    //  1) Filter injection -> matches first user without knowing a real password
    //     { "email": { "$ne": null }, "password": { "$ne": null } }
    //     or use "username" instead of "email".
    //  2) $where JavaScript -> force predicate true via crafted strings
    //     { "username": "alice' || true || '", "password": "x" }
    //  3) Regex password match -> pattern that matches anything
    //     { "email": "alice@example.com", "password": ".*" }
    if (vulnerable.isSqlIVulnerable()) {
      if ((!email && !username) || password === undefined) {
        return res.status(400).json({ success: false, message: "email or username, and password are required" });
      }

      const idFilter = email ? { email } : { username };
      let user = null;

      // 1) Classic filter injection: operator objects in password/email/username
      //    User.findOne({ ...idFilter, password }) with attacker-controlled
      //    objects (e.g., { $ne: null }) will match without a real password.
      user = await User.findOne({ ...idFilter, password });

      // 2) $where JavaScript predicate built from inputs
      //    Crafting id/password values that break the string can yield a
      //    trivially true expression (e.g., "' || true || '").
      if (!user) {
        const idKey = email ? "email" : "username";
        const idVal = email ? String(email) : String(username);
        const passVal = String(password);
        const where = `this.${idKey}=='${idVal}' && this.password=='${passVal}'`;
        user = await User.findOne({ $where: where });
      }

      // 3) Regex password match (e.g., ".*" matches anything)
      //    If password parses as a regex, match succeeds without the real secret.
      if (!user) {
        let regex;
        try {
          regex = new RegExp(password);
        } catch (e) {
          // invalid pattern -> ensure no match by using a never-matching regex
          regex = /^a\b$/;
        }
        user = await User.findOne({ ...idFilter, password: { $regex: regex } });
      }

      if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = signToken(user);

      return res
        .cookie("accessToken", token, cookieOpts)
        .json({
          user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    }

    // SAFE PATH (default): find by id then compare password separately
    // Note: passwords are stored in plaintext in this lab; in real apps use bcrypt
    // and never log secrets.
    if ((!email && !username) || !password) {
      return res.status(400).json({ success: false, message: "email or username, and password are required" });
    }

    const user = await User.findOne(email ? { email } : { username });
    console.log(user);
    if (!user || !(req.body.password == user.password)) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user);

    res
      .cookie("accessToken", token, cookieOpts)
      .json({
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", cookieOpts);
  res.json({ message: "Logged out" });
};

