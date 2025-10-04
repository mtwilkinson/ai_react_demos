import React, { useState } from 'react';

interface HelloWorldPageProps {}

const HelloWorldPage: React.FC<HelloWorldPageProps> = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Hello World</h1>
            <p className="text-lg mb-4">Count: {count}</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>
        </div>
    );
};

export default HelloWorldPage;