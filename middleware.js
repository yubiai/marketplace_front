import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    "/((?!api|_next/static).*)",
    "/"
  ],
}

export async function middleware(req) {
  // Check Edge Config to see if the maintenance page should be shown
  const isInMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE == "1" ? true : false;

  // If in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    req.nextUrl.pathname = `/maintenance`

    // Rewrite to the url
    return NextResponse.rewrite(req.nextUrl)
  }
}