import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyReviews = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchReviews = async () => {
            try {
                const { data } = await axiosSecure.get(`/api/user/${user.email}/reviews`);
                setReviews(data);
            } catch (err) {
                toast.error("Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [user]);

    const handleDelete = async (reviewId) => {
        try {
            await axiosSecure.delete(`/api/user/${user.email}/reviews/${reviewId}`);
            setReviews(reviews.filter((rev) => rev._id !== reviewId));
            toast.success("Review deleted successfully");
        } catch (err) {
            toast.error("Failed to delete review");
        }
    };

    if (!user) return <p className="text-center mt-10">Please log in to view your reviews.</p>;

    if (loading) return <p className="text-center mt-10">Loading your reviews...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>

            {reviews.length === 0 ? (
                <p>No reviews yet</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="border rounded p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{rev.donationTitle}</h3>
                            <p><strong>Restaurant:</strong> {rev.donationRestaurant}</p>
                            <p><strong>Rating:</strong> {rev.rating}/5</p>
                            <p>{rev.description}</p>
                            <p className="text-gray-500 text-sm">
                                Reviewed on: {new Date(rev.createdAt).toLocaleString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <Link
                                    to={`/donations/${rev.donationId}`}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    View Donation
                                </Link>
                                <button
                                    onClick={() => handleDelete(rev._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;
