import React, { useEffect, useState } from 'react';
// import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';

const FeaturedSections = () => {
    const axios = useAxios();
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchFeaturedDonations = async () => {
            try {
                const res = await axios.get("/api/featured-donations");
                setDonations(res.data);
            } catch (err) {
                console.error("Error fetching featured donations:", err);
            }
        };

        fetchFeaturedDonations();
    }, [axios]);

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold text-center mb-8">
                🌟 Featured Donations
            </h2>

            {donations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {donations.slice(0, 4).map((donation) => (
                        <div
                            key={donation._id}
                            className="card bg-base-100 shadow-xl rounded-xl overflow-hidden"
                        >
                            <figure>
                                <img
                                    src={donation.image}
                                    alt={donation.title}
                                    className="h-40 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg font-bold">
                                    {donation.title}
                                </h3>
                                <p className="text-sm">
                                    <span className="font-semibold">Food Type:</span>{" "}
                                    {donation.foodType}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Restaurant:</span>{" "}
                                    {donation.restaurantName}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Location:</span>{" "}
                                    {donation.location}
                                </p>
                                <p
                                    className={`text-sm font-semibold ${donation.status === "Available"
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    Status: {donation.status}
                                </p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/donations/${donation._id}`}>
                                        <button className="btn btn-primary btn-sm">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    No featured donations available.
                </p>
            )}
        </div>
    );

};

export default FeaturedSections;