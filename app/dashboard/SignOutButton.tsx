'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/') // Redirect to home page after sign out
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
        >
            Sign Out
        </button>
    )
}