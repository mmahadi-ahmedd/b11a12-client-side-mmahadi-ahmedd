import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageRequests = () => {
    const axiosSecure = useAxiosSecure();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axiosSecure.get("/api/admin/requests");
                setRequests(data);
            } catch (err) {
                toast.error("Failed to fetch charity requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;

        try {
            await axiosSecure.delete(`/api/admin/requests/${id}`);
            setRequests((prev) => prev.filter((req) => req._id !== id));
            toast.success("Request deleted successfully");
        } catch (err) {
            toast.error("Failed to delete request");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading requests...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Manage Charity Requests</h2>

            {requests.length === 0 ? (
                <p>No requests found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead >
                            <tr>
                                <th className="py-2 px-4 border">Donation Title</th>
                                <th className="py-2 px-4 border">Charity Name</th>
                                <th className="py-2 px-4 border">Charity Email</th>
                                <th className="py-2 px-4 border">Request Description</th>
                                <th className="py-2 px-4 border">Pickup Time</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id}>
                                    <td className="py-2 px-4 border">{req.donationTitle}</td>
                                    <td className="py-2 px-4 border">{req.charityName}</td>
                                    <td className="py-2 px-4 border">{req.charityEmail}</td>
                                    <td className="py-2 px-4 border">{req.description}</td>
                                    <td className="py-2 px-4 border">{req.pickupTime}</td>
                                    <td className="py-2 px-4 border">{req.status}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDelete(req._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
