import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — Manages user authentication state.
 * Uses localStorage for persistence across page refreshes.
 * Provides login, register, logout, and user profile update.
 */
const AuthContext = createContext(null);

// Default admin account for testing
const ADMIN_USER = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@shopverse.com',
    role: 'admin',
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('shopverse_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('shopverse_user');
            }
        }
        setLoading(false);
    }, []);

    // Persist user state to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('shopverse_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('shopverse_user');
        }
    }, [user]);

    /** Mock login — accepts any credentials; admin@shopverse.com logs in as admin */
    const login = async (email, password) => {
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 800));

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (email === 'admin@shopverse.com') {
            setUser(ADMIN_USER);
            return ADMIN_USER;
        }

        const mockUser = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: 'customer',
        };
        setUser(mockUser);
        return mockUser;
    };

    /** Mock register */
    const register = async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 800));

        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }

        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'customer',
        };
        setUser(newUser);
        return newUser;
    };

    /** Logout the current user */
    const logout = () => {
        setUser(null);
    };

    /** Update user profile info */
    const updateProfile = (updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Custom hook for consuming auth context */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
