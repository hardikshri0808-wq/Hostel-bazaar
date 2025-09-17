import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-lg bg-zinc-800 h-full hover:shadow-cyan-500/50 transition-shadow">
        <img
          src={listing.imageUrl}
          alt={listing.itemName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{listing.itemName}</h3>
          <p className="text-lg font-bold mt-2">₹{listing.price}</p>
          <p className="text-sm text-zinc-400 mt-1">
            Seller: {listing.owner?.fullName || 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  );
}