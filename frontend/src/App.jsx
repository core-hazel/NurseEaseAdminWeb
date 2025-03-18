import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './components/ui/card';

import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const LandingPageAndLogin = () => {
    const [hospital, setHospital] = useState('');
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (hospital && adminId && password) {
            navigate('/dashboard');
        } else {
            alert('Please fill all fields.');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-lavender">
            <h1 className="text-3xl font-bold mb-8">NurseEase Admin Portal</h1>

            <Card className="w-96 shadow-2xl rounded-2xl p-6">
                <CardContent>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Hospital</label>
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            className="w-full p-2 rounded border"
                        >
                            <option value="">-- Select Hospital --</option>
                            <option value="Hospital A">Hospital A</option>
                            <option value="Hospital B">Hospital B</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Admin ID</label>
                        <Input value={adminId} onChange={(e) => setAdminId(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={handleLogin}>Login</Button>
                        <Button onClick={handleRegister} variant="secondary">Register</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LandingPageAndLogin;

