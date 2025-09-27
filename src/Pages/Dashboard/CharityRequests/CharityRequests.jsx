import { useEffect, useState } from "react"; // 👈 import here
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CharityRequests = () => {
  const [requests, setRequests] = useState([]);
   const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get("api/admin/charity-requests")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`api/admin/charity-requests/${id}/approve`);
      toast.success("Request approved!");
      setRequests(prev =>
        prev.map(r => r._id === id ? { ...r, status: "Approved" } : r)
      );
    } catch (err) {
      toast.error("Error approving request");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`api/admin/charity-requests/${id}/reject`);
      toast.info("Request rejected!");
      setRequests(prev =>
        prev.map(r => r._id === id ? { ...r, status: "Rejected" } : r)
      );
    } catch (err) {
      toast.error("Error rejecting request");
    }
  };

  return (
    <div className="overflow-x-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Charity Requests</h2>
      <table className="table w-full">
        <thead>
          <tr className="bg-gray-100">
            <th>User</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Mission</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.organizationName}</td>
              <td>{req.mission}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  req.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : req.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="flex gap-2 justify-center">
                {req.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="btn btn-success btn-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="btn btn-error btn-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                {req.status !== "Pending" && (
                  <span className="text-gray-500">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharityRequests;
