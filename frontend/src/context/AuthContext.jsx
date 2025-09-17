import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios'

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // This effect runs once when the app component mounts
        const checkUserSession = async () => {
            try {
                // Make a request to the refresh-token endpoint
                const response = await apiClient.post('/api/v1/users/refresh-token');
                // If successful, the user has a valid session
                setAuthUser(response.data.data.user);
            } catch (error) {
                // If it fails, it just means the user isn't logged in
                setAuthUser(null);
            } finally {
                // Stop loading once the check is complete
                setLoading(false);
            }
        };

        checkUserSession();
    }, []); // Empty dependency array means it runs only on mount

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};