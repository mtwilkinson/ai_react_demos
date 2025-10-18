import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
    success: boolean;
    message?: string;
}

const Homepage: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        try {
            // Placeholder post API call
            const response: ApiResponse = await axios.post("/api/prompt", {"prompt": prompt})
            setToastMessage(response.message || 'Prompt submitted successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        } catch (error) {
            setToastMessage('Error submitting prompt');
            console.log(error);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow bg-gray-100 p-4 flex flex-col items-center justify-center min-h-0">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Create Your Prompt</h1>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a detailed prompt for the AI to build a React webpage..."
                    className="w-full h-80 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    {isLoading ? 'Submitting...' : 'Submit Prompt'}
                </button>
            </div>
            {showToast && (
                <div className="fixed centered bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-10">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default Homepage;
