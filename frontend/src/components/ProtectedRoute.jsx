import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { authUser, loading } = useAuth(); // Get loading state from context

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
}