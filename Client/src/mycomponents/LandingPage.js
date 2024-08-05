import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaUserShield } from 'react-icons/fa';
import '../css/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate('/items');
    };

    const handleAdminClick = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='body'>
            <div className="landing-container">
                <h1 className='wel'>Welcome</h1>
                <p>Select your role to continue</p>
                <div className="options-container">
                    <motion.div
                        className="option-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleUserClick}
                    >
                        <FaUser className="option-icon" />
                        <h2>User</h2>
                    </motion.div>
                    <motion.div
                        className="option-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleAdminClick}
                    >
                        <FaUserShield className="option-icon" />
                        <h2>Admin</h2>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
