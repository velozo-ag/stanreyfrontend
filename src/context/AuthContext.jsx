import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { Usuario } from '../models/Usuario';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { ...Usuario });
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    // const navigate = useNavigate();

    const login = async (usuario, password) => {
        try {
            const response = await api.post('/auth/signin', { usuario, password });
            const { token, usuario: userData } = response.data;

            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            return true;
        } catch (error) {
            console.error('Error en login: ', error);
            return false;
        }
    };

    const logout = () => {
        setToken('');
        setUser({ ...Usuario });
        setIsAuthenticated(false);

        localStorage.removeItem('user')
        localStorage.removeItem('token');
    }

    useEffect(() => {
        const verifyToken = async () => {
            if (!token || isAuthenticated) return;
            if (token) {
                try {
                    await api.get('/auth/verify');
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Token invalido: ', error);
                    logout();
                }
            }
        }
        verifyToken();
    }, [token])

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};