import { NextResponse } from 'next/server'
import { verifyUser } from './app/api-integeration/auth'
import { NextRequest } from 'next/server'

export async function middleware(request) {
    const pathname = request.nextUrl.pathname
    const restrictedPaths = ["/admin/dashboard"]

    const isRestricted = restrictedPaths.some(path => pathname.startsWith(path))

    const json = await verifyUser()

    if (json?.success && isRestricted) {
        if (pathname.startsWith("/admin/dashboard") && json?.role !== 'ADMIN') {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/dashboard/:path*"],
}
