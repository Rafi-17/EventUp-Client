import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react'; // Example icon for a general error

const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 font-inter">
            <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                <div className="relative mb-6">
                    {/* The main illustration or number */}
                    <div className="text-9xl font-extrabold text-[#FF6B00] dark:text-[#E55A00] opacity-80 z-0">
                        404
                    </div>
                    {/* A friendly icon on top of the number */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Frown className="w-24 h-24 text-gray-600 dark:text-gray-300" />
                    </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Oops! Page Not Found</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    It seems you've stumbled upon a page that doesn't exist. Don't worry, it happens to the best of us.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#FF6B00] hover:bg-[#E55A00] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
