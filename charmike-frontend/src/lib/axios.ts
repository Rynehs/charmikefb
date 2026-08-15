import axios from "axios";

// Calls same-origin Next.js route handlers at /api/proxy/*, which forward
// to Laravel server-side with the Bearer token attached from the httpOnly
// cookie. The browser never talks to Laravel directly and never sees the
// token — see src/app/api/proxy/[...path]/route.ts.
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    Accept: "application/json",
  },
});

export default api;
