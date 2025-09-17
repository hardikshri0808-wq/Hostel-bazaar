import { Link } from 'react-router-dom';

export default function MyListingCard({ listing, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-zinc-800 h-full flex flex-col">
      <Link to={`/listings/${listing._id}`} className="block">
        <img
          src={listing.imageUrl}
          alt={listing.itemName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{listing.itemName}</h3>
          <p className="text-lg font-bold mt-2">₹{listing.price}</p>
        </div>
      </Link>
      
      {/* Management Buttons */}
      <div className="mt-auto p-4 border-t border-zinc-700 flex gap-2">
        <Link 
          to={`/edit-listing/${listing._id}`} 
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Link>
        <button 
          onClick={() => onDelete(listing._id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}