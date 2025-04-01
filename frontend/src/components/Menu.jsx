import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/chat/history', {
            headers: { Authorization: localStorage.getItem('token') }
        })
        .then(res => setHistory(res.data))
        .catch(err => console.error("Failed to fetch chat history", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Chat History</h2>
                
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-center text-gray-400">No chat history available.</p>
                    ) : (
                        history.map((chat, index) => (
                            <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md">
                                <p className="text-sm text-gray-300">{new Date(chat.timestamp).toLocaleString()}</p>
                                <p className="text-lg text-gray-100"><strong>You:</strong> {chat.message}</p>
                                <p className="text-lg text-blue-300"><strong>Bot:</strong> {chat.botReply}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
