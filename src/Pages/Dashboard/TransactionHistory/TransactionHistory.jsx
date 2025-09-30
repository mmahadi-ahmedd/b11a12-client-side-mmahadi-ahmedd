// import React, { useEffect, useState } from "react";
// import useAuth from "../../../hooks/useAuth";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// const TransactionHistory = () => {
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();

//     const [userInfo, setUserInfo] = useState(null);
//     const [charityReq, setCharityReq] = useState(null);
//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!user?.email) return;

//         const fetchData = async () => {
//             try {
//                 // ✅ Fetch user info
//                 const userRes = await axiosSecure.get(`api/users/${user.email}`);
//                 setUserInfo(userRes.data);

//                 // ✅ Fetch charity request info
//                 const charityRes = await axiosSecure.get(`api/charityrequests/${user.email}`);
//                 setCharityReq(charityRes.data);

//                 // ✅ Fetch payments
//                 const paymentRes = await axiosSecure.get(`api/payments/${user.email}`);
//                 setPayments(paymentRes.data);

//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [user?.email, axiosSecure]);

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="p-6 rounded-xl shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

//             {/* ✅ User role */}
//             <div className="mb-4">
//                 {userInfo?.role === "charity" ? (
//                     <p className="text-green-600 font-semibold">Assigned as Charity</p>
//                 ) : (
//                     <p className="text-red-600 font-semibold">Not a Charity</p>
//                 )}
//             </div>

//             {/* ✅ Charity Request Payment Status */}
//             <div className="mb-4">
//                 {charityReq?.paymentStatus === "Paid" ? (
//                     <p className="text-green-600 font-semibold">Payment Paid</p>
//                 ) : (
//                     <p className="text-red-600 font-semibold">Payment Unpaid</p>
//                 )}
//             </div>

//             {/* ✅ Payment History */}
//             {payments.length > 0 ? (
//                 <table className="table w-full">
//                     <thead>
//                         <tr>
//                             <th>Transaction ID</th>
//                             <th>Amount</th>
//                             <th>Status</th>
//                             <th>Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {payments.map((p) => (
//                             <tr key={p._id}>
//                                 <td>{p.transactionId}</td>
//                                 <td>${p.amount / 100}</td>
//                                 <td>{p.paymentStatus}</td>
//                                 <td>{new Date(p.date).toLocaleDateString()}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p>No payments found.</p>
//             )}
//         </div>
//     );
// };

// export default TransactionHistory;










import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TransactionHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchPayments = async () => {
            try {
                const res = await axiosSecure.get(`/api/payments/${user.email}`);
                setPayments(res.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching payments:", err);
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.email, axiosSecure]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

            {payments.length > 0 ? (
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p._id}>
                                <td>{p.transactionId}</td>
                                <td>${p.amount }</td>
                                <td>{p.paymentStatus}</td>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-red-500 font-semibold">Not Paid</p>
            )}
        </div>
    );
};

export default TransactionHistory;
