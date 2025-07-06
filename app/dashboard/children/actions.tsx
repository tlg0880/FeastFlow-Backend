'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Define the shape of the form data
type FormState = {
    message: string;
    success: boolean;
};

export async function createChildAccount(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const cookieStore = cookies();

    // This is the correct way to create a client within a Server Action
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    );

    const { data: { user: parentUser } } = await supabase.auth.getUser();

    if (!parentUser) {
        return { success: false, message: 'Authentication error: Parent not found.' };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (!email || !password || !firstName || !lastName) {
        return { success: false, message: 'All fields are required.' };
    }

    // Create a separate ADMIN client using the Service Role Key
    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: { // Provide the same cookie implementation
                get: (name) => cookieStore.get(name)?.value,
                set: (name, value, options) => cookieStore.set({ name, value, ...options }),
                remove: (name, options) => cookieStore.set({ name, value: '', ...options })
            }
        }
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });


    if (authError) {
        console.error('Auth Error:', authError);
        return { success: false, message: `Failed to create child account: ${authError.message}` };
    }
    if (!authData?.user) {
        return { success: false, message: 'Failed to get child user data after creation.' };
    }

    const childUserId = authData.user.id;
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
            role: 'child',
            parent_id: parentUser.id,
        })
        .eq('id', childUserId);

    if (profileError) {
        console.error('Profile Update Error:', profileError);
        await supabaseAdmin.auth.admin.deleteUser(childUserId);
        return { success: false, message: `Failed to update child profile: ${profileError.message}` };
    }

    redirect('/dashboard/children');
}