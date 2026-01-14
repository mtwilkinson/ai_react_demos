import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
    success: boolean;
    message: string;
}

const Homepage: React.FC = () => {
    const [selectedExample, setSelectedExample] = useState<number>(0);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Placeholder post API call
            const response: { data: ApiResponse } = await axios.post("/api/prompt", {"prompt": prompt, "example": selectedExample }, { timeout: 120000 });
            setToastMessage(response.data.message);
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

    const handleUndo = async () => {
        setIsLoading(true);
        try {
            // Placeholder post API call
            const response:{ data: ApiResponse } = await axios.get("/api/undo");
            setToastMessage(response.data.message);
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
                <h1 className="text-2xl font-bold mb-4 text-center">Create Your Prompt</h1><div className="mb-6">
                <label className="block text-lg font-semibold mb-4 text-gray-700">Base on existing page</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((example) => (
                        <button
                            key={example}
                            onClick={() => setSelectedExample(example === selectedExample ? 0 : example)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${selectedExample === example ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        >
                            {`example ${example}`}
                        </button>
                    ))}
                </div>
            </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a detailed prompt for the AI to build a React webpage..."
                    className="w-full h-80 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex space-x-4">
                    <button
                        onClick={handleUndo}
                        disabled={isLoading}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
                    >
                        Undo Prompt
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt.trim()}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Prompt'}
                    </button>
                </div>
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