import createMiddleware from "next-intl/middleware"
import { routing } from "./routing"
export const localeProxy = createMiddleware(routing)
