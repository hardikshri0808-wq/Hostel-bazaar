import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios'

export default function ListingDetail() {
  // useParams hook gets the ID from the URL (e.g., /listings/:listingId)
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiClient.get(`/api/v1/listings/${listingId}`);
        setListing(response.data.data);
      } catch (err) {
        setError('Failed to load listing.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]); // Re-run this effect if the listingId changes

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!listing) {
    return <div className="p-4 text-center">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={listing.imageUrl}
            alt={listing.itemName}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">{listing.itemName}</h1>
          <p className="text-zinc-400 text-lg mb-4">{listing.category}</p>
          <p className="text-3xl font-bold text-cyan-400 mb-6">₹{listing.price}</p>
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-zinc-300 mb-6">{listing.description}</p>
          <h2 className="text-2xl font-semibold mb-2">Seller Information</h2>
          <div className="text-zinc-300">
            <p><strong>Name:</strong> {listing.owner?.fullName}</p>
            <p><strong>Hostel:</strong> {listing.owner?.hostelName}, Room {listing.owner?.hostelRoomNo}</p>
            <a href={`mailto:${listing.owner?.email}`} className="text-cyan-400 hover:underline">
              Email Seller
            </a>
            <br />
            <a href={`tel:${listing.owner?.phoneNumber}`} className="text-cyan-400 hover:underline">
              Call Seller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}