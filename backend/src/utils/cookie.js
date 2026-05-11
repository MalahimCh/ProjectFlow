// ─── Refresh Token Cookie Options ────────────────────────────────────────────
// httpOnly: JS cannot read it (XSS protection)
// secure: HTTPS only in production
// sameSite: CSRF protection

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms — must match JWT_REFRESH_EXPIRES_IN
  path: "/api/auth", // cookie only sent to auth routes, not every request
});

export const clearRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/api/auth",
});