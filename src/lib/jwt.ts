/**
 * JWT token utilities for validation and expiration checking
 */

export interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Decode a JWT token without verification
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Get the expiration time of a JWT token
 * @param token - The JWT token
 * @returns The expiration timestamp in seconds, or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeToken(token);
  return payload?.exp || null;
}

/**
 * Check if a token will expire within a specified number of seconds
 * @param token - The JWT token
 * @param seconds - Number of seconds to check ahead (default: 300 = 5 minutes)
 * @returns true if token will expire soon, false otherwise
 */
export function willTokenExpireSoon(token: string, seconds: number = 300): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expiring soon
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;
  return expirationTime - currentTime <= seconds;
}
