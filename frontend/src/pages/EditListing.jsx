import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axios'

export default function EditListing() {
  const { listingId } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch the existing listing data when the component loads
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await apiClient.get(`/api/v1/listings/${listingId}`);
        // 2. Pre-populate the form with the fetched data
        reset(response.data.data);
      } catch (error) {
        console.error("Failed to fetch listing data", error);
        setServerError("Could not load listing data.");
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
  }, [listingId, reset]);

  // 3. Handle the form submission to update the data
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      // Note: We are not handling image updates in this form for simplicity.
      await apiClient.patch(`/api/v1/listings/${listingId}`, data);
      navigate('/my-listings');
    } catch (err) {
      console.error('Update failed:', err);
      setServerError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !serverError) {
    return <div className="p-4 text-center">Loading form...</div>;
  }
  
  if (serverError) {
    return <div className="p-4 text-center text-red-500">{serverError}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Your Listing</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Item Name</label>
          <input {...register('itemName', { required: 'Item Name is required' })} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
          {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea {...register('description', { required: 'Description is required' })} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Price (₹)</label>
          <input {...register('price', { required: 'Price is required', valueAsNumber: true })} type="number" className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select {...register('category', { required: 'Category is required' })} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700">
            <option value="">Select a Category</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationery">Stationery</option>
            <option value="Services">Services</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}