import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MealSelectionForm from './MealSelectionForm';
import { getWeekStartDate } from '@/lib/utils'; // We will create this utility file

export default async function SelectMealsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/login');
    }

    // Fetch parent's children
    const { data: children } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('parent_id', user.id);

    if (!children || children.length === 0) {
        return (
            <div className="text-center p-8">
                <p>You must add a child before you can select meals.</p>
                <a href="/dashboard/children" className="text-blue-600">Add a Child</a>
            </div>
        );
    }

    // Determine which child is selected (from URL or default to first child)
    const selectedChildId = searchParams.child || children[0].id;
    const selectedChild = children.find(c => c.id === selectedChildId);

    // Fetch the menu for the current week
    const weekStartDate = getWeekStartDate(new Date());
    const { data: weeklyMenu } = await supabase
        .from('weekly_menus')
        .select('menu_item_ids')
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .single();

    let menuItems = [];
    if (weeklyMenu?.menu_item_ids) {
        const { data: items } = await supabase
            .from('menu_items')
            .select('*')
            .in('id', weeklyMenu.menu_item_ids);
        menuItems = items || [];
    }

    // Fetch any existing order for this child for this week
    const { data: existingOrder } = await supabase
        .from('orders')
        .select('selections')
        .eq('child_id', selectedChildId)
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .single();

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Weekly Meal Selection</h1>
            <MealSelectionForm
                parent={user}
                children={children}
                selectedChild={selectedChild}
                menuItems={menuItems}
                weekStartDate={weekStartDate}
                existingSelections={existingOrder?.selections || {}}
            />
        </div>
    );
}