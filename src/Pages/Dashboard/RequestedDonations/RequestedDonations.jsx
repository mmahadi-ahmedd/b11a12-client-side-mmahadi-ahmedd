import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RequestedDonations = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchRequests = async () => {
            try {
                const { data } = await axiosSecure.get(`/api/restaurant/${user.email}/requests`);
                setRequests(data);
            } catch (err) {
                toast.error("Failed to fetch donation requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [user]);

    const handleAccept = async (id) => {
        try {
            await axiosSecure.patch(`/api/requests/${id}/accept`);
            toast.success("Request accepted");
            setRequests(
                requests.map((req) =>
                    req._id === id ? { ...req, status: "Accepted" } : req.donationId === requests.find(r => r._id === id).donationId ? { ...req, status: "Rejected" } : req
                )
            );
        } catch (err) {
            toast.error("Failed to accept request");
        }
    };

    const handleReject = async (id) => {
        try {
            await axiosSecure.patch(`/api/requests/${id}/reject`);
            toast.success("Request rejected");
            setRequests(requests.map((req) => (req._id === id ? { ...req, status: "Rejected" } : req)));
        } catch (err) {
            toast.error("Failed to reject request");
        }
    };

    if (!user) return <p className="text-center mt-10">Please log in to view requests.</p>;
    if (loading) return <p className="text-center mt-10">Loading requests...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Donation Requests</h2>

            {requests.length === 0 ? (
                <p>No donation requests yet</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((req) => (
                        <div key={req._id} className="border rounded p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{req.donationTitle}</h3>
                            <p><strong>Food Type:</strong> {req.donationType}</p>
                            <p><strong>Charity:</strong> {req.charityName}</p>
                            <p><strong>Email:</strong> {req.charityEmail}</p>
                            <p><strong>Request Description:</strong> {req.description}</p>
                            <p><strong>Pickup Time:</strong> {req.pickupTime}</p>
                            <p><strong>Status:</strong> {req.status}</p>
                            <div className="flex gap-2 mt-2">
                                {req.status === "Pending" && (
                                    <>
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestedDonations;
