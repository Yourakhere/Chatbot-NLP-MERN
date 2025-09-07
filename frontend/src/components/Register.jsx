import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('https://chat-nlp-backend.vercel.app/auth/register', { username, password });
            
             
            toast.success("✅ Registered successfully! Please log in.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
             
            toast.error("❌ Registration failed. Try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-300">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">Sign Up</h2>
                <p className="text-center text-gray-600 mb-6">Create an account to get started</p>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                    Register
                </button>

                <button 
                    className="text-center text-gray-600 mt-4" 
                    onClick={() => navigate('/')}
                >
                    Already have an account? Login
                </button>
            </div>
 
            <ToastContainer />
        </div>
    );
};

export default Register;

