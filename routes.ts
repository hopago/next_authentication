/**
 * accessible to public
 * do not require authentication
 * @type { string[] }
 */
export const publicRoutes: string[] = ["/"];

/**
 * used for authentication
 * redirect logged in users to /settings
 * @type { string[] }
 */
export const protectedRoutes: string[] = ["/login", "/register", "/error/auth"];

/**
 * prefix for API auth routes
 * routes that start with this prefix are used for API
 * @type { string }
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * default redirect url
 * @type { string }
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
