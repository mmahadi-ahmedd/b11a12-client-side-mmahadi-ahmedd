import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const ManageUsers = () => {

    const axiosSecure = useAxiosSecure();

    const [users, setUsers] = useState([]);

    // fetch all users
    useEffect(() => {
        axiosSecure.get("api/users")
            .then(res => setUsers(res.data))
            .catch(() => toast.error("Failed to load users"));
    }, []);

    const handleRoleChange = async (id, role) => {
        try {
            await axiosSecure.patch(`api/users/${id}/make-${role}`);
            toast.success(`User updated to ${role}`);
            setUsers(users.map(u => u._id === id ? { ...u, role } : u));
        } catch {
            toast.error("Failed to update role");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosSecure.delete(`api/users/${id}`);
            toast.success("User deleted");
            setUsers(users.filter(u => u._id !== id));
        } catch {
            toast.error("Failed to delete user");
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role || "User"}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleRoleChange(user._id, "admin")}
                                        className="btn btn-xs btn-primary"
                                    >
                                        Make Admin
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange(user._id, "restaurant")}
                                        className="btn btn-xs btn-success"
                                    >
                                        Make Restaurant
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange(user._id, "charity")}
                                        className="btn btn-xs btn-accent"
                                    >
                                        Make Charity
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;