import mongoose from "mongoose";


// Simple toggle accessor for intentionally vulnerable mode.
// Read from process.env.VULNERABLE_MODE (string "true").
// Default: false (safe).
// --------------------------------------------------
// Warning: Do NOT enable VULNERABLE_MODE=true on any public or production systems.
// Only enable in isolated lab environments for research/education.
const isVulnerable = () => {
  return String(process.env.VULNERABLE_MODE || "false").toLowerCase() === "true";
};

// Toggle for NoSQL injection demo in auth (CTF only).
// Read from process.env.VULNERABLE_SQLI_MODE (string "true").
// Default: false (safe).
const isSqlIVulnerable = () => {
  return String((process.env.VULNERABLE_MODE && process.env.VULNERABLE_SQLI_MODE) || "false").toLowerCase() === "true";
};

export default { isVulnerable, isSqlIVulnerable };
