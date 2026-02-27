import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute — Wraps child routes that require authentication.
 * Optionally requires a specific role (e.g., 'admin') for access.
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user, loading } = useAuth();

    // Show loader while auth state is being resolved
    if (loading) {
        return <Loader text="Checking authentication..." />;
    }

    // Redirect unauthenticated users to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect users without the required role
    if (requiredRole && user.role !== requiredRole) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl mb-4">
                    🚫
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
                <p className="mt-2 text-gray-500 max-w-md">
                    You don't have permission to access this page. This area is restricted to {requiredRole} users only.
                </p>
                <Navigate to="/" replace />
            </div>
        );
    }

    return children;
}
