/**
 * An array of routes that are accessible to the public
 * This routes do not require authentication
 */
export const publicRoutes = [
    "/",
    "/movies",
    "/movies/:id",
    "/favourites",
    "/my-bookings"
]


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in user to /settings
 * @types {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/error",
]


/**
 * The prefix for API authentication routes.
 * Routes that starts with this prefix are used for API authentication purpose
 * @types {string}
 */
export const apiAuthPrefix = "/api/auth";

export const apiHandlers = "/api"

/**
 * The default redirect path after loggin in
 * @types {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/"


/**
 * Route that define the admin routes: /api/admin
 */
export const adminRoutes = "/api/admin"