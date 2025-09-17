import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios.js'
import { useState } from 'react';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await apiClient.post('/api/v1/users/login', data);
      
      // Set the user in the global context
      setAuthUser(response.data.data.user);
      
      // Navigate to the home page
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email or Username"
          {...register('email', { required: 'Email or Username is required' })}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

        <Input
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-cyan-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}