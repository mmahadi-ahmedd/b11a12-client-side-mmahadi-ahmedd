import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminProfile = () => {

    const { user } = useAuth(); // logged-in user from context
    const [admin, setAdmin] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/api/users/${user.email}`)
                .then(res => setAdmin(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    if (!admin) {
        return <p className="text-center">Loading profile...</p>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-md p-6 shadow-lg rounded-2xl ">
                <div className="flex flex-col items-center text-center space-y-4">
                    <img
                        src={admin.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                        alt="Admin Avatar"
                        className="w-24 h-24 rounded-full border"
                    />
                    <h2 className="text-2xl font-bold">{admin.name}</h2>
                    <p className="text-gray-600">{admin.email}</p>
                    <span className="badge badge-primary">{admin.role || "Admin"}</span>
                    <div className="mt-4 w-full text-left space-y-2">
                        <p><strong>Joined:</strong> {admin.created_at || "N/A"}</p>
                        <p><strong>Last Login:</strong> {admin.last_log_in || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;