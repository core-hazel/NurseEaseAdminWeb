import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
    const data = [
        { name: 'Superadmins', value: 4 },
        { name: 'Managers', value: 10 },
        { name: 'Staff', value: 20 }
    ];

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold mb-4">Hospital Admin Panel</h1>
                <nav>
                    <ul>
                        <li className="mb-2 cursor-pointer">Dashboard</li>
                        <li className="mb-2 cursor-pointer">Admins</li>
                        <li className="mb-2 cursor-pointer">Settings</li>
                    </ul>
                </nav>
                <Button className="mt-4 w-full" variant="outline"><LogOut className="mr-2" />Logout</Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

                {/* Statistics Card */}
                <Card className="mb-6">
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Admin Statistics</h3>
                                <p>Total Users: 34</p>
                            </div>
                            <div className="w-64 h-64">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
