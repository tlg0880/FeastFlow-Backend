'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createChildAccount } from './actions';

const initialState = {
    message: '',
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {pending ? 'Creating...' : 'Add Child'}
        </button>
    );
}

export default function AddChildForm() {
    const [state, formAction] = useFormState(createChildAccount, initialState);

    return (
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Child's First Name</label>
                <input type="text" id="firstName" name="firstName" required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Child's Last Name</label>
                <input type="text" id="lastName" name="lastName" required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Child's Email</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Set Initial Password</label>
                <input type="password" id="password" name="password" required className="mt-1 block w-full input-field" />
            </div>
            <div className="md:col-span-2">
                <SubmitButton />
            </div>
            {!state.success && state.message && (
                <p className="text-sm text-red-600 mt-2 md:col-span-2">{state.message}</p>
            )}
        </form>
    );
}