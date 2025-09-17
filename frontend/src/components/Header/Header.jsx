import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../api/axios'

export default function Header() {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/users/logout');
      setAuthUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

return (
    <header className="bg-zinc-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">HostelBaazar</Link>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:text-zinc-400">Home</Link>
          {authUser ? (
            <>
              <Link to="/my-listings" className="hover:text-zinc-400">My Listings</Link>
              <Link to="/create-listing" className="hover:text-zinc-400">Create Listing</Link>
              <span className="text-zinc-300">Welcome, {authUser.fullName}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-zinc-400">Login</Link>
              <Link to="/register" className="hover:text-zinc-400">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}