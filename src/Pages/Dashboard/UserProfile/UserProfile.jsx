import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserProfile = () => {
    const { user } = useAuth(); // ✅ user from context
    const axiosSecure = useAxiosSecure();

    const [favorites, setFavorites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch user-specific data
    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const [favRes, reqRes, revRes] = await Promise.all([
                    axiosSecure.get(`/api/user/${user.email}/favorites`),
                    axiosSecure.get(`/api/user/${user.email}/requests`),
                    axiosSecure.get(`/api/user/${user.email}/reviews`),
                ]);

                setFavorites(favRes.data);
                setRequests(reqRes.data);
                setReviews(revRes.data);
            } catch (err) {
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    // ✅ Remove favorite
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
        return <p className="text-center mt-10">Please log in to view your profile.</p>;
    }

    if (loading) {
        return <p className="text-center mt-10">Loading profile...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* User Info */}
            <div className="border p-4 rounded mb-6">
                <h2 className="text-2xl font-bold mb-2">User Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            {/* Favorites */}
            <div className="border p-4 rounded mb-6">
                <h3 className="text-xl font-semibold mb-2">Favorites</h3>
                {favorites.length === 0 ? (
                    <p>No favorites yet</p>
                ) : (
                    favorites.map((fav) => (
                        <div key={fav._id} className="flex justify-between items-center border-b py-2">
                            <span>{fav.donationTitle || "Donation Item"}</span>
                            <button
                                onClick={() => handleRemoveFavorite(fav.donationId)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Requests */}
            <div className="border p-4 rounded mb-6">
                <h3 className="text-xl font-semibold mb-2">Your Requests</h3>
                {requests.length === 0 ? (
                    <p>No requests submitted</p>
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="border-b py-2">
                            <p><strong>Donation:</strong> {req.donationTitle || "Donation Item"}</p>
                            <p><strong>Status:</strong> {req.status}</p>
                            <p><strong>Pickup Time:</strong> {req.pickupTime}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Reviews */}
            <div className="border p-4 rounded">
                <h3 className="text-xl font-semibold mb-2">Your Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} className="border-b py-2">
                            <p><strong>Donation:</strong> {rev.donationTitle || "Donation Item"}</p>
                            <p><strong>Rating:</strong> {rev.rating}/5</p>
                            <p>{rev.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserProfile;
