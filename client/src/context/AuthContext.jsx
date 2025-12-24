import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to get new access token (using refresh cookie)
                const { data } = await api.post('/auth/refresh');
                setToken(data.accessToken);

                // Then get user info
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);
            } catch (err) {
                // Not logged in or expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Helper to set token header
    const setToken = (token) => {
        localStorage.setItem('accessToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setToken(data.token);
        setUser(data);
        // We could fetch full user object if data doesn't contain all fields, but controller returns it.
    };

    const register = async (name, email, password, role, licenseNumber) => {
        const { data } = await api.post('/auth/register', { name, email, password, role, licenseNumber });
        setUser(data);
        localStorage.setItem('accessToken', data.token);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
