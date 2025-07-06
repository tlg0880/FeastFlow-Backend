'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type UpsertOrderPayload = {
    childId: string;
    weekStartDate: Date;
    selections: { [key: string]: string | null };
    totalAmount: number;
};

export async function upsertOrder(payload: UpsertOrderPayload) {
    const supabase = createClient();

    // "upsert" will create a new order if one doesn't exist, or update it if it does.
    // We match based on the unique combination of child_id and week_start_date.
    const { data, error } = await supabase.from('orders').upsert({
        child_id: payload.childId,
        week_start_date: payload.weekStartDate.toISOString().split('T')[0],
        selections: payload.selections,
        status: 'PENDING_APPROVAL', // Move to pending approval once a selection is made
        total_amount: payload.totalAmount,
    }, {
        onConflict: 'child_id, week_start_date'
    }).select().single();

    if (error) {
        console.error("Upsert order error:", error);
        return { error: error.message };
    }

    // Clear the cache for this page so the next load gets fresh data
    revalidatePath('/dashboard/select-meals');

    return { data };
}