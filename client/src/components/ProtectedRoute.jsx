import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    // Check if user is logged in
    if (!userInfo || !userInfo.token) {
        return <Navigate to="/login" replace />;
    }

    // Check if token is expired
    try {
        const decoded = jwtDecode(userInfo.token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            // Token expired, clear storage and redirect
            localStorage.removeItem('userInfo');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        // Invalid token
        localStorage.removeItem('userInfo');
        return <Navigate to="/login" replace />;
    }

    // Check if admin access is required
    if (requireAdmin && !userInfo.isAdmin && userInfo.role !== 'admin' && userInfo.role !== 'super_admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
