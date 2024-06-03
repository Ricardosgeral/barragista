/**
 * An array of routes that are acessible to the public
 * Don't require authentications
 * @type{string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification", "/api/uploadthing"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in ussers to /settings
 * @type{string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes z
 * Routes that start with this prefix are used for API authentication
 * @type{string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type{string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";