import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';  

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('https://chat-nlp-backend.vercel.app/auth/login', { username, password });//http://localhost:5000
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            toast.success("Login successful! 🎉");  
            setTimeout(() => navigate('/'), 1500);  
        } catch (error) {
            toast.error("Login failed. Please check your credentials."); 
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            <Toaster position="top-right" reverseOrder={false} />  
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-300">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-6">Sign in to continue</p>

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
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                    Login
                </button>

                <button onClick={() => navigate('/register')} className="text-center text-gray-600 mt-4">
                    Don't have an account? Create Account
                </button>
            </div>
        </div>
    );
};

export default Login;

