import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../css/Login.css';
const serverUrl = process.env.REACT_APP_API_URL;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${serverUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const { token } = await response.json();
            localStorage.setItem('jwtToken', token); // Save JWT token to localStorage
            navigate('/dashboard'); // Redirect to dashboard
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        }
    };

    return (
        <div className='body'>
            <div className="login-container">
                <motion.div 
                    className="login-card"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <motion.div
                            className="input-group"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="input-group"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        >
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </motion.div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            Login
                        </motion.button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    <motion.p
                        className="forgot-password"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    >
                        Forgot Password?
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
