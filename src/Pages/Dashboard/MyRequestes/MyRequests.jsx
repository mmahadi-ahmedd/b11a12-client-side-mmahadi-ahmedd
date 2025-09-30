import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyRequests = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchRequests = async () => {
            try {
                const { data } = await axiosSecure.get(`/api/charity/${user.email}/requests`);
                setRequests(data);
            } catch (err) {
                toast.error("Failed to fetch your requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [user]);

    const handleCancel = async (requestId) => {
        try {
            await axiosSecure.delete(`/api/charity/${user.email}/requests/${requestId}`);
            setRequests(requests.filter((req) => req._id !== requestId));
            toast.success("Request canceled successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel request");
        }
    };

    if (!user) return <p className="text-center mt-10">Please log in to view your requests.</p>;
    if (loading) return <p className="text-center mt-10">Loading your requests...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">My Donation Requests</h2>

            {requests.length === 0 ? (
                <p>No donation requests yet</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((req) => (
                        <div key={req._id} className="border rounded p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{req.donationTitle}</h3>
                            <p><strong>Restaurant:</strong> {req.restaurantName}</p>
                            <p><strong>Food Type:</strong> {req.donationType}</p>
                            <p><strong>Quantity:</strong> {req.quantity}</p>
                            <p><strong>Status:</strong> {req.status}</p>
                            <p><strong>Pickup Time:</strong> {req.pickupTime}</p>
                            <p><strong>Description:</strong> {req.description}</p>

                            {req.status === "Pending" && (
                                <button
                                    onClick={() => handleCancel(req._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
                                >
                                    Cancel Request
                                </button>
                            )}

                            <Link
                                to={`/donations/${req.donationId}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2 w-max"
                            >
                                View Donation
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequests;
