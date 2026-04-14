import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// paths that require admin authentication
const adminPaths = ['/management']
// paths that require customer authentication
const customerPaths = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Admin Protection
  if (adminPaths.some(path => pathname.startsWith(path))) {
    const adminToken = request.cookies.get('adminToken')?.value

    if (!adminToken) {
      // redirect to login if no admin token
      const url = new URL('/management/signin', request.url)
      return NextResponse.redirect(url)
    }
  }

  // 2. Customer Protection
  if (customerPaths.some(path => pathname.startsWith(path))) {
    const userToken = request.cookies.get('userToken')?.value

    if (!userToken) {
      const url = new URL('/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/management/:path*', '/dashboard/:path*'],
}
