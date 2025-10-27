// Frontend vulnerability toggles (mirrors backend style)
// Read from Vite env (VITE_*), treat value "true" (case-insensitive) as enabled

const toBool = (v) => String(v ?? "false").toLowerCase() === "true";

const isUiVulnerable = () => {
  return toBool(import.meta.env.VITE_VULNERABLE_UI_MODE);
};

export default { isUiVulnerable };

