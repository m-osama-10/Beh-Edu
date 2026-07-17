/**
 * Shared session constants.
 * Imported by both API routes and the session helper.
 * Keep this file dependency-free to avoid circular imports.
 */

export const SESSION_COOKIE = "bb_session";

/** Cookie max-age in seconds (7 days). */
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * Create a session token for a user.
 * Format: base64url(userId:email:role:expiry:hmac)
 *
 * NOTE: This is a simple demo token. For production, use a proper JWT
 * signed with NEXTAUTH_SECRET (jsonwebtoken or jose).
 */
export function createSessionToken(
  userId: string,
  email: string,
  role: string,
): string {
  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${userId}:${email}:${role}:${expiry}`;
  // For demo: append a random hex (NOT cryptographically secure).
  // In production, replace with: HMAC-SHA256(payload, NEXTAUTH_SECRET)
  const hmac = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

/** Parse a session token. Returns null if invalid or expired. */
export function parseSessionToken(token: string): {
  userId: string;
  email: string;
  role: string;
  expiry: number;
} | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return null;
    const [userId, email, role, expiryStr] = parts;
    const expiry = parseInt(expiryStr);
    if (!expiry || Date.now() > expiry) return null;
    return { userId, email, role, expiry };
  } catch {
    return null;
  }
}
