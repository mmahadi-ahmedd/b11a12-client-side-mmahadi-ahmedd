import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Favourites = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const { data } = await axiosSecure.get(`/api/user/${user.email}/favorites`);
        setFavorites(data);
      } catch (err) {
        toast.error("Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (donationId) => {
    try {
      await axiosSecure.delete(`/api/user/${user.email}/favorites/${donationId}`);
      setFavorites(favorites.filter((fav) => fav.donationId !== donationId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove favorite");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Please log in to view favorites.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading favorites...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div key={fav._id} className="border rounded p-4 flex flex-col gap-2">
              <img
                src={fav.donationImage || "/default-donation.jpg"}
                alt={fav.donationTitle}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-semibold">{fav.donationTitle}</h3>
              <p><strong>Restaurant:</strong> {fav.donationRestaurant}</p>
              <p><strong>Location:</strong> {fav.donationLocation}</p>
              <p><strong>Quantity:</strong> {fav.donationQuantity}</p>
              <p><strong>Status:</strong> {fav.donationStatus}</p>
              <div className="flex justify-between mt-2">
                <Link
                  to={`/donations/${fav.donationId}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(fav.donationId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
