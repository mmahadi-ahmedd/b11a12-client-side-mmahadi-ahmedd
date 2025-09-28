import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const FeatureDonations = () => {
    const [donations, setDonations] = useState([]);
    const axiosSecure = useAxiosSecure();

    // Fetch only verified donations
    const fetchDonations = async () => {
        try {
            const res = await axiosSecure.get("/api/verified-donations");
            setDonations(res.data);
        } catch (err) {
            console.error("Failed to fetch verified donations", err);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Handle feature
    const handleFeature = async (id) => {
        try {
            await axiosSecure.patch(`/api/donations/feature/${id}`);
            toast.success("Donation marked as Featured!");
            fetchDonations(); // refresh list
        } catch (err) {
            toast.error("Failed to feature donation");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Feature Donations</h2>

            {donations.length === 0 ? (
                <p className="text-gray-600">No verified donations available to feature.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Food Type</th>
                                <th>Restaurant</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation, index) => (
                                <tr key={donation._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={donation.image}
                                            alt={donation.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td>{donation.title}</td>
                                    <td>{donation.foodType}</td>
                                    <td>{donation.restaurantName}</td>
                                    <td>
                                        {donation.featured ? (
                                            <span className="badge badge-success">Featured</span>
                                        ) : (
                                            <button
                                                onClick={() => handleFeature(donation._id)}
                                                className="btn btn-primary btn-xs"
                                            >
                                                Feature
                                            </button>
                                        )}
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

export default FeatureDonations;
