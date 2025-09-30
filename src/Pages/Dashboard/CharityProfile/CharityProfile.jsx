import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CharityProfile = () => {
  const { id } = useParams(); // Charity user id from route
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get(`/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [axiosSecure, id]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-base-100 shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Charity Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Image */}
        <img
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />

        {/* Name */}
        <h3 className="text-xl font-semibold">{user.name || "No Name"}</h3>

        {/* Email */}
        <p className="text-gray-600">{user.email}</p>

        {/* Role */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user.role === "charity"
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Role: {user.role}
        </span>
      </div>
    </div>
  );
};

export default CharityProfile;
