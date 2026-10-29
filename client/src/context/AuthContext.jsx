import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('griha_admin_token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await API.get('/auth/verify');
                if (res.data.valid) {
                    setAdmin(res.data.admin);
                } else {
                    logout();
                }
            } catch (err) {
                logout();
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, []);

    const login = async (username, password) => {
        const res = await API.post('/auth/login', { username, password });
        localStorage.setItem('griha_admin_token', res.data.token);
        setAdmin({ username: res.data.username });
    };

    const logout = () => {
        localStorage.removeItem('griha_admin_token');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, isAdmin: !!admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);