import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
            <div className="space-y-4">
                <Link to="/schedule">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                        View Nurse Schedules
                    </button>
                </Link>
                <Link to="/register-admin">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                        Register Admin
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;

