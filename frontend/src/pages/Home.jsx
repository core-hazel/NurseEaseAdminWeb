import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-2xl p-4 m-4 shadow-lg">
                <CardContent>
                    <h1 className="text-3xl font-bold mb-4 text-foreground">Welcome to Hospital Management System</h1>
                    <p className="text-lg mb-6 text-muted-foreground">Manage your hospital’s data efficiently and securely.</p>
                    <Link to="/login">
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                            Go to Dashboard
                        </button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;

