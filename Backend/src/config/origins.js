const fromEnv = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const allowedOrigins = [
  ...new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "https://gradlink-neon.vercel.app",
    ...fromEnv,
  ]),
];