import Head from 'next/head';
import Link from 'next/link'; // Use Next.js Link for client-side navigation

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <Head>
                <title>Welcome to FeastFlow</title>
            </Head>

            <main className="text-center p-8">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">
                    Welcome to <span className="text-blue-600">FeastFlow</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    Delicious, healthy, and convenient school lunches, delivered right to your school.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/login" // We will create this page next
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Parent & Child Login
                    </Link>
                    <a
                        href="#"
                        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </main>
        </div>
    );
}