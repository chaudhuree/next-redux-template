import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('accessToken');

    // Protect routes that require authentication
    if (
        pathname === '/products' || 
        pathname.startsWith('/products/create') || 
        pathname.startsWith('/products/edit')
    ) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/products',
        '/products/create', 
        '/products/edit/:path*'
    ],
};
