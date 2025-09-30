import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import AddReviewForm from "../Donations/AddReviewForm"; // Reuse your AddReviewForm component
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ReceivedDonations = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [received, setReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsMap, setReviewsMap] = useState({}); // store reviews per donation

    useEffect(() => {
        if (!user) return;

        const fetchReceivedDonations = async () => {
            try {
                const { data } = await axiosSecure.get(`/api/charity/${user.email}/received`);
                setReceived(data);

                // Fetch reviews for each donation
                const reviewsData = {};
                for (const donation of data) {
                    const res = await axiosSecure.get(`/api/charity/received/${donation.donationId}/reviews`);
                    reviewsData[donation.donationId] = res.data;
                }
                setReviewsMap(reviewsData);
            } catch (err) {
                toast.error("Failed to fetch received donations");
            } finally {
                setLoading(false);
            }
        };

        fetchReceivedDonations();
    }, [user]);

    const handleAddReview = async (donationId, review) => {
        try {
            await axiosSecure.post(`/api/charity/received/${donationId}/review`, review);

            // Update local reviews
            setReviewsMap((prev) => ({
                ...prev,
                [donationId]: [...(prev[donationId] || []), review],
            }));
            toast.success("Review added successfully");
        } catch (err) {
            toast.error("Failed to add review");
        }
    };

    if (!user) return <p className="text-center mt-10">Please log in to view received donations.</p>;
    if (loading) return <p className="text-center mt-10">Loading received donations...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Received Donations</h2>

            {received.length === 0 ? (
                <p>No donations received yet</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {received.map((donation) => (
                        <div key={donation._id} className="border rounded p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{donation.donationTitle}</h3>
                            <p><strong>Restaurant:</strong> {donation.restaurantName}</p>
                            <p><strong>Food Type:</strong> {donation.foodType}</p>
                            <p><strong>Quantity:</strong> {donation.quantity}</p>
                            <p><strong>Pickup Time:</strong> {donation.pickupTime}</p>
                            <p><strong>Status:</strong> {donation.status}</p>

                            <Link
                                to={`/donations/${donation.donationId}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-max mt-2"
                            >
                                View Donation
                            </Link>

                            {/* Reviews */}
                            <div className="mt-4 border-t pt-2">
                                <h4 className="font-semibold mb-2">Reviews</h4>
                                {(reviewsMap[donation.donationId] || []).length === 0 ? (
                                    <p>No reviews yet</p>
                                ) : (
                                    reviewsMap[donation.donationId].map((review, idx) => (
                                        <div key={idx} className="border-b py-1">
                                            <p className="font-semibold">{review.reviewerName}</p>
                                            <p>Rating: {review.rating}/5</p>
                                            <p>{review.description}</p>
                                        </div>
                                    ))
                                )}

                                {/* <AddReviewForm
                                    onSubmit={(review) => handleAddReview(donation.donationId, { ...review, reviewerName: user.name, reviewerEmail: user.email })}
                                /> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceivedDonations;
