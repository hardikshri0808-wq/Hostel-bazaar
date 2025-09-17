import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios'
import { useState } from 'react';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await apiClient.post('/api/v1/users/register', data);
      console.log('Registration successful:', response.data);
      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields with validation */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            {...register('fullName', { required: 'Full Name is required' })}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
            type="email"
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            type="password"
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            {...register('phoneNumber', { required: 'Phone Number is required', pattern: { value: /^\d{10}$/, message: 'Must be a 10-digit phone number' } })}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
        </div>

        <div className="flex gap-4">
            <div className="w-1/2">
                <label className="block mb-1">Hostel Name</label>
                <input
                    {...register('hostelName', { required: 'Hostel Name is required' })}
                    className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                />
                {errors.hostelName && <p className="text-red-500 text-sm mt-1">{errors.hostelName.message}</p>}
            </div>
            <div className="w-1/2">
                <label className="block mb-1">Room No.</label>
                <input
                    {...register('hostelRoomNo', { required: 'Room No. is required' })}
                    className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                />
                {errors.hostelRoomNo && <p className="text-red-500 text-sm mt-1">{errors.hostelRoomNo.message}</p>}
            </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}