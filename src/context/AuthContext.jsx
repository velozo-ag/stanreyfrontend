import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = async (usuario, password) => {
        try {
            const response = await api.post('/auth/signin', { usuario, password });
            const { token, usuario: userData } = response.data;
            console.log('Respuesta de login:', response.data);

            const decoded = jwtDecode(token);
            const role = decoded.roles || decoded.authorities || userData.perfil?.descripcion || 'ROLE_CLIENTE';

            const updatedUserData = {
                ...userData,
                idUsuario: userData.idUsuario || decoded.idUsuario,
                role
            };

            setToken(token);
            setUser(updatedUserData);
            setIsAuthenticated(true);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            return true;
        } catch (error) {
            console.error('Error en login: ', error);
            return false;
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        setIsAuthenticated(false);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        const verifyToken = async () => {
            if (!token || isAuthenticated) return;
            try {
                await api.get('/auth/verify');
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token inválido: ', error);
                logout();
            }
        };
        verifyToken();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};