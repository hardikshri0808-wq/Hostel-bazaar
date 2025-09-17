import { useState, useEffect } from 'react';
import apiClient from '../api/axios'
import ListingCard from '../components/ListingCard/ListingCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function is called when the component first loads
    const fetchListings = async () => {
      try {
        // Fetch data from the backend
        const response = await apiClient.get('/api/v1/listings');
        // The actual listings are inside the 'docs' array of the response data
        setListings(response.data.data.docs);
        setError(null);
      } catch (err) {
        setError('Failed to load listings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // The empty array [] means this effect runs only once

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}