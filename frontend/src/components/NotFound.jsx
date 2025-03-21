import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/dashboard">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default NotFound;

