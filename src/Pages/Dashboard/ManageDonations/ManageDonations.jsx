import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageDonations = () => {
    const [donations, setDonations] = useState([]);
    const axiosSecure = useAxiosSecure();

    // Fetch all donations
    const fetchDonations = async () => {
        try {
            const res = await axiosSecure.get("/api/donations");
            setDonations(res.data);
        } catch (err) {
            console.error("Failed to fetch donations", err);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Verify Donation
    const handleVerify = async (id) => {
        try {
            await axiosSecure.patch(`/api/donations/verify/${id}`);
            toast.success("Donation verified successfully!");
            fetchDonations();
        } catch (err) {
            toast.error("Failed to verify donation");
        }
    };

    // Reject Donation
    const handleReject = async (id) => {
        try {
            await axiosSecure.patch(`/api/donations/reject/${id}`);
            toast.success("Donation rejected successfully!");
            fetchDonations();
        } catch (err) {
            toast.error("Failed to reject donation");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Donations</h2>

            {donations.length === 0 ? (
                <p className="text-gray-600">No donations available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Food Type</th>
                                <th>Quantity</th>
                                <th>Restaurant Name</th>
                                <th>Restaurant Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation, index) => (
                                <tr key={donation._id}>
                                    <td>{index + 1}</td>
                                    <td>{donation.title}</td>
                                    <td>{donation.foodType}</td>
                                    <td>{donation.quantity}</td>
                                    <td>{donation.restaurantName}</td>
                                    <td>{donation.restaurantEmail}</td>
                                    <td>
                                        <span
                                            className={`badge ${donation.status === "Verified"
                                                    ? "badge-success"
                                                    : donation.status === "Rejected"
                                                        ? "badge-error"
                                                        : "badge-warning"
                                                }`}
                                        >
                                            {donation.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        {donation.status === "Pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleVerify(donation._id)}
                                                    className="btn btn-success btn-xs"
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    onClick={() => handleReject(donation._id)}
                                                    className="btn btn-error btn-xs"
                                                >
                                                    Reject
                                                </button>
                                            </div>
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

export default ManageDonations;
