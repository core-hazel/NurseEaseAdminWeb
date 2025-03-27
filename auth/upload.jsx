import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


const upload = () => {
    const [departments, setDepartments] = useState(['Cardiology', 'Neurology']);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleGenerateSchedule = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/generate-schedule', { departments });
            setSchedule(response.data.schedule);
            setLoading(false);
        } catch (error) {
            console.error('Error generating schedule:', error);
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/upload-file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl">
                <CardContent>
                    <h1 className="text-3xl font-bold mb-6">Generate Nurse Schedule</h1>
                    <Button onClick={handleGenerateSchedule} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Schedule'}
                    </Button>

                    {schedule && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold mb-4">Generated Schedule:</h2>
                            <pre className="p-4 bg-gray-200 rounded-xl">
                                {JSON.stringify(schedule, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Upload Nurse Data (Excel/CSV)</h2>
                        <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
                        <Button onClick={handleFileUpload} className="mt-2">Upload File</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default upload;