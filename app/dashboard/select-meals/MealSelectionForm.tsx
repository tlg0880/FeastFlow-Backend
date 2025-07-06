'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { upsertOrder } from './actions'; // We will create this Server Action next

// Define types for the data we are receiving
type Child = { id: string; first_name: string; last_name: string };
type MenuItem = { id: string; name: string; description: string | null; image_url: string | null };
type Selections = { [key: string]: string | null };

export default function MealSelectionForm({
    children,
    selectedChild,
    menuItems,
    weekStartDate,
    existingSelections
}: {
    parent: any;
    children: Child[];
    selectedChild: Child | undefined;
    menuItems: MenuItem[];
    weekStartDate: Date;
    existingSelections: Selections;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selections, setSelections] = useState<Selections>(existingSelections);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // When the selected child changes, update the state
    useEffect(() => {
        setSelections(existingSelections);
    }, [selectedChild, existingSelections]);

    const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const childId = e.target.value;
        // Update the URL to reflect the selected child, which will trigger a re-render
        router.push(`/dashboard/select-meals?child=${childId}`);
    };

    const handleSelectionChange = async (day: string, menuItemId: string) => {
        const newSelections = { ...selections, [day]: menuItemId };
        setSelections(newSelections);
        setIsSaving(true);

        // Call the server action to "autosave"
        const result = await upsertOrder({
            childId: selectedChild!.id,
            weekStartDate,
            selections: newSelections,
            totalAmount: 5 * 12000 // Placeholder flat rate
        });

        if (result.error) {
            setMessage(`Autosave failed: ${result.error}`);
        } else {
            setMessage('Selection saved!');
            // Clear message after a few seconds
            setTimeout(() => setMessage(''), 2000);
        }
        setIsSaving(false);
    };

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    if (!selectedChild) {
        return <div>Please select a child.</div>;
    }

    if (menuItems.length === 0) {
        return <div>The menu for this week has not been published yet.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex-grow">
                    <label htmlFor="child-select" className="block text-sm font-medium text-gray-700">Select Child:</label>
                    <select
                        id="child-select"
                        value={selectedChild.id}
                        onChange={handleChildChange}
                        className="mt-1 block w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {children.map(child => (
                            <option key={child.id} value={child.id}>
                                {child.first_name} {child.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                {isSaving && <div className="text-sm text-gray-500">Saving...</div>}
                {message && <div className="text-sm text-green-600">{message}</div>}
            </div>

            <form className="bg-white p-6 rounded-lg shadow-md space-y-8">
                {daysOfWeek.map((day, index) => (
                    <div key={day}>
                        <h3 className="text-xl font-semibold capitalize mb-4 border-b pb-2">{day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menuItems.map(item => (
                                <div key={item.id} className="border rounded-lg p-4">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={day}
                                            value={item.id}
                                            checked={selections[day] === item.id}
                                            onChange={() => handleSelectionChange(day, item.id)}
                                            className="mt-1 h-4 w-4"
                                        />
                                        <div className="flex-1">
                                            {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2" />}
                                            <span className="font-bold text-gray-800">{item.name}</span>

                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="pt-5">
                    <button type="button" className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
                        Confirm Selections for the Week
                    </button>
                </div>
            </form>
        </div>
    );
}