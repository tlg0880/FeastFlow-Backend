import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Although middleware protects this page, it's good practice
    // to have a server-side check as well.
    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
                <p className="mt-4 text-lg text-gray-600">
                    You are logged in as: <span className="font-semibold text-blue-600">{user.email}</span>
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <a href="/dashboard/children" className="text-blue-600 hover:underline">Manage Children</a>
                    <a href="/dashboard/select-meals" className="text-blue-600 hover:underline">Select Meals</a>
                </div>
                <div className="mt-8">
                    <SignOutButton />
                </div>
            </div>
        </div>
    )
}
