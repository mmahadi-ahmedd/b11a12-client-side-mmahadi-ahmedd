// src/pages/AllDonations.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    // Fetch verified donations from backend
    const fetchVerifiedDonations = async () => {
        try {
            const { data } = await axiosSecure.get(`/api/verified-donations`);
            setDonations(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch verified donations.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifiedDonations();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading donations...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6 text-center">All Verified Donations</h2>
            {donations.length === 0 ? (
                <p className="text-center">No verified donations available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
                        <div key={donation._id} className="border rounded-lg shadow-lg p-4 flex flex-col">
                            <img
                                src={donation.image || "/default-donation.jpg"}
                                alt={donation.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-xl font-bold">{donation.title}</h3>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">Restaurant:</span> {donation.restaurantName}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">Location:</span> {donation.location || "N/A"}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">Charity:</span> {donation.charityName || "Not Assigned"}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">Status:</span>{" "}
                                <span className="font-bold text-green-600">{donation.status}</span>
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-semibold">Quantity:</span> {donation.quantity} {donation.unit || "kg"}
                            </p>
                            <Link
                                to={`/donation/${donation._id}`}
                                className="mt-auto bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition mt-4"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllDonations;
