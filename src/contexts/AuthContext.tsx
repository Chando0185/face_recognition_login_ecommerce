import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/localStorage';

interface User {
    id: string;
    name: string;
    email: string;
    faceDescriptor?: number[] | null;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => getStorageItem(STORAGE_KEYS.CURRENT_USER, null));

    useEffect(() => {
        if (user) {
            setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
        } else {
            removeStorageItem(STORAGE_KEYS.CURRENT_USER);
        }
    }, [user]);

    const login = (userData: User) => setUser(userData);
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
