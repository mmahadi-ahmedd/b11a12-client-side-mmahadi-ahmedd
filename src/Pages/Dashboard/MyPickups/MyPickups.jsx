import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyPickups = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPickups = async () => {
      try {
        const { data } = await axiosSecure.get(`/api/charity/${user.email}/pickups`);
        setPickups(data);
      } catch (err) {
        toast.error("Failed to fetch pickups");
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, [user]);

  const handleConfirmPickup = async (requestId) => {
    try {
      await axiosSecure.patch(`/api/charity/${user.email}/pickups/${requestId}/confirm`);
      setPickups(pickups.filter((p) => p._id !== requestId)); // remove from pickups, it will appear in received donations
      toast.success("Pickup confirmed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm pickup");
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in to view your pickups.</p>;
  if (loading) return <p className="text-center mt-10">Loading pickups...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">My Pickups</h2>

      {pickups.length === 0 ? (
        <p>No pickups assigned yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pickups.map((pickup) => (
            <div key={pickup._id} className="border rounded p-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{pickup.donationTitle}</h3>
              <p><strong>Restaurant:</strong> {pickup.restaurantName}</p>
              <p><strong>Location:</strong> {pickup.location}</p>
              <p><strong>Food Type:</strong> {pickup.foodType}</p>
              <p><strong>Quantity:</strong> {pickup.quantity}</p>
              <p><strong>Pickup Time:</strong> {pickup.pickupTime}</p>
              <p><strong>Status:</strong> {pickup.status}</p>

              <div className="flex gap-2 mt-2">
                <Link
                  to={`/donations/${pickup.donationId}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Donation
                </Link>
                <button
                  onClick={() => handleConfirmPickup(pickup._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Confirm Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPickups;
