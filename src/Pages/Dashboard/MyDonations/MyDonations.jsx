import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyDonations = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axiosSecure
                .get(`/api/my-donations/${user.email}`)
                .then((res) => setDonations(res.data))
                .catch((err) => console.error("Failed to fetch donations", err));
        }
    }, [user]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Donations</h2>

            {donations.length === 0 ? (
                <p className="text-gray-600">You haven’t added any donations yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Food Type</th>
                                <th>Quantity</th>
                                <th>Pickup Time</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation, index) => (
                                <tr key={donation._id}>
                                    <td>{index + 1}</td>
                                    <td>{donation.title}</td>
                                    <td>{donation.foodType}</td>
                                    <td>{donation.quantity}</td>
                                    <td>{donation.pickupTime}</td>
                                    <td>
                                        <span
                                            className={`badge ${donation.status === "Approved"
                                                    ? "badge-success"
                                                    : donation.status === "Rejected"
                                                        ? "badge-error"
                                                        : "badge-warning"
                                                }`}
                                        >
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyDonations;
