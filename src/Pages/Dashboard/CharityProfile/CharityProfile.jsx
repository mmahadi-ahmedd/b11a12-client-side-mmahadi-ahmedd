import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CharityProfile = () => {
  const [charity, setCharity] = useState(null);
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`http://localhost:5000/api/charity/${user.email}`)
        .then(res => setCharity(res.data))
        .catch(err => console.error(err));
    }
  }, [user?.email]);

  if (!charity) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">No charity profile found or still pending approval.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
      <div className="flex flex-col items-center">
        <img
          src={charity.logo || "https://via.placeholder.com/100"}
          alt="Charity Logo"
          className="w-24 h-24 rounded-full mb-4 border"
        />
        <h2 className="text-xl font-bold">{charity.organizationName}</h2>
        <p className="text-sm text-gray-500">{charity.email}</p>
        <span className="px-3 py-1 mt-2 text-sm bg-green-100 text-green-700 rounded-full">
          Charity
        </span>
        <div className="mt-4 text-center">
          <h3 className="font-semibold text-lg">Mission</h3>
          <p className="text-gray-600">{charity.mission}</p>
        </div>
      </div>
    </div>
  );
};

export default CharityProfile;
