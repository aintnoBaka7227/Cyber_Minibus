// server/index.js
import dotenv from "dotenv";
import express from "express";
import vulnerable from "./configs/vulnerable.js";


dotenv.config();

const app = express();


const ALLOWLIST = new Set(Object.keys(process.env));

// Enable CORS (allow request from any origin)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/steal", (req, res) => {

  const incomingToken = req.query.token; // what attacker sent
  console.log("Incoming token param:", incomingToken);

  // By default we treat the incoming value as a literal token value.
  let resolved = incomingToken;

  // Resolve only if the incoming string looks like a variable name and if VULNERABLE_MODE is set to "true".
  const looksLikeEnvName = typeof incomingToken === "string" && /^[A-Z0-9_]+$/.test(incomingToken);

  if (looksLikeEnvName) {
    if (ALLOWLIST.has(incomingToken) && vulnerable.isVulnerable()) {
      resolved = process.env[incomingToken];
      console.log(`Resolved ${incomingToken} -> ${resolved}`);
    } else {
      console.warn(`Attempt to resolve env var "${incomingToken}" blocked as due to VULNERABLE MODE being turned off.`);
      resolved = "[REDACTED]";
    }
  }

  console.log("Token Stolen Successfully:", resolved);
  res.send({ incoming: incomingToken, resolved });
});

app.listen(3001, () => console.log("Attacker server running on http://localhost:3001"));
