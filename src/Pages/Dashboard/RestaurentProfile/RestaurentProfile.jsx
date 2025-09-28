import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RestaurantProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/api/users/${user.email}`)
                .then(res => setRestaurant(res.data))
                .catch(err => console.error("Failed to load profile", err));
        }
    }, [user]);

    if (!restaurant) {
        return <p className="text-center mt-10">Loading profile...</p>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                <div className="flex flex-col items-center text-center space-y-4">
                    <img
                        src={restaurant.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                        alt="Restaurant Logo"
                        className="w-24 h-24 rounded-full border"
                    />
                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                    <p className="text-gray-600">{restaurant.email}</p>
                    <span className="badge badge-success">{restaurant.role || "Restaurant"}</span>
                    <div className="mt-4 w-full text-left space-y-2">
                        <p><strong>Address:</strong> {restaurant.address || "Not provided"}</p>
                        <p><strong>Contact:</strong> {restaurant.contact || "Not provided"}</p>
                        <p><strong>Joined:</strong> {restaurant.created_at || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;
