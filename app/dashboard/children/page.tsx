import { createClient } from '@/lib/supabase/server';
import AddChildForm from './AddChildForm';
import { redirect } from 'next/navigation';

export default async function ChildrenManagementPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch the children linked to the currently logged-in parent
  const { data: children, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role')
    .eq('parent_id', user.id);

  if (error) {
    console.error("Error fetching children:", error);
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Your Children</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add a New Child</h2>
        <AddChildForm />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Registered Children</h2>
        {children && children.length > 0 ? (
          <ul className="space-y-3">
            {children.map((child) => (
              <li key={child.id} className="p-4 border rounded-md flex justify-between items-center">
                <span className="font-medium">{child.first_name} {child.last_name}</span>
                <span className="text-sm text-gray-500">Role: {child.role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have not added any children yet.</p>
        )}
      </div>
    </div>
  );
}