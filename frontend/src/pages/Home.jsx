import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl p-4 m-4 shadow-lg">
                <CardContent>
                    <h1 className="text-3xl font-bold mb-4">Welcome to Hospital Management System</h1>
                    <p className="text-lg mb-6">Manage your hospital’s data efficiently and securely.</p>
                    <Link to="/login">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">Go to Dashboard</button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;

