import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../context/AuthContext';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Get the authenticated user from context
    const hospitalId = user?.hospitalId; // Get the hospital ID from the authenticated user

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    // Handle file upload
    const handleFileUpload = async (file: File, hospitalId: string) => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("hospital_id", hospitalId);

        try {
            const response = await fetch("http://localhost:8000/upload-file", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to upload file.");
            }

            const data = await response.json();
            alert(`File uploaded successfully! ${data.records_uploaded} records saved.`);
            console.log("Response:", data);
        } catch (error) {
            console.error("Error uploading file:", error);
            if (error instanceof Error) {
                alert(error.message || "Failed to upload file. Please try again.");
            } else {
                alert("Failed to upload file. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-900">
            <Card className="w-full max-w-2xl p-6 bg-gray-800 rounded-2xl shadow-xl">
                <CardContent>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Upload Nurse Data (Excel/CSV)</h2>
                        <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
                        />
                        <Button
                            onClick={() => handleFileUpload(file!!, hospitalId!!)}
                            className={`mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Upload;