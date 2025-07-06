import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = new URL(request.url)

    if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && url.pathname.startsWith('/admin')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if (user && url.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}