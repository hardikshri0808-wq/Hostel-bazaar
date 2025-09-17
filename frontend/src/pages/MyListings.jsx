import { useState, useEffect } from 'react';
import apiClient from '../api/axios'
import MyListingCard from '../components/MyListingCard/MyListingCard'; // Use the new card
import { useAuth } from '../context/AuthContext';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) return;
    const fetchUserListings = async () => {
      try {
        const response = await apiClient.get('/api/v1/listings/my-listings');
        setListings(response.data.data);
      } catch (err) {
        setError('Failed to load your listings.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserListings();
  }, [authUser]);

  // Function to handle the delete action
  const handleDelete = async (listingId) => {
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/listings/${listingId}`);
      // Update the UI by removing the deleted listing from the state
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.error('Failed to delete listing:', err);
      setError('Failed to delete listing. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading your listings...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      {listings.length === 0 ? (
        <p>You haven't created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <MyListingCard
              key={listing._id}
              listing={listing}
              onDelete={handleDelete} // Pass the delete handler to the card
            />
          ))}
        </div>
      )}
    </div>
  );
}