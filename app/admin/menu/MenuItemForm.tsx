'use client'

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MenuItemForm() {
    const supabase = createClient();
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [allergens, setAllergens] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        // Convert comma-separated string of allergens to a text array
        const allergensArray = allergens.split(',').map(s => s.trim()).filter(s => s);

        const { error } = await supabase
            .from('menu_items')
            .insert({
                name,
                description,
                allergens: allergensArray
            });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Meal added successfully!');
            // Reset form
            setName('');
            setDescription('');
            setAllergens('');
            // Refresh the page to show the new item in the list
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Meal Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"></textarea>
            </div>
            <div>
                <label htmlFor="allergens" className="block text-sm font-medium text-gray-700">Allergens (comma-separated)</label>
                <input type="text" id="allergens" value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="e.g. peanut, dairy, gluten" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Add Meal</button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
}