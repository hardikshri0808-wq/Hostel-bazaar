import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export default function CreateListing() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('itemName', data.itemName);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('listingImage', data.listingImage[0]); // Get the file

    try {
      const response = await axios.post('/api/v1/listings/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Navigate to the new listing's detail page
      navigate(`/listings/${response.data.data._id}`);
    } catch (err) {
      console.error('Creation failed:', err);
      setServerError(err.response?.data?.message || 'Creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Listing</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Fields for itemName, description, price */}
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

        <div>
          <label className="block mb-1">Image</label>
          <input {...register('listingImage', { required: 'Image is required' })} type="file" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
          {errors.listingImage && <p className="text-red-500 text-sm mt-1">{errors.listingImage.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}