// import React from 'react';
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import useAxiosSecure from '../../hooks/useAxiosSecure';
// import useAuth from '../../hooks/useAuth';

// const BeCharity = () => {
//     const { user } = useAuth();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors }
//     } = useForm();
//     const axiosSecure = useAxiosSecure();

//     const onSubmit = async (data) => {
//         const charityData = {
//             name: user?.displayName || data.name,  // 👈 fallback if no displayName
//             email: user?.email || data.email,      // 👈 fallback if no email
//             organizationName: data.organizationName,
//             mission: data.mission,
//             status: "Pending",
//             createdAt: new Date(),
//         };
//         try {
//             const token = localStorage.getItem("token"); // JWT saved on login
//             const res = await axiosSecure.post(
//                 "api/charity-requests",
//                 charityData,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             toast.success(res.charityData.message || "Charity request submitted!");
//             reset();
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.charityData?.message || "Failed to submit request");
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
//             <h2 className="text-2xl font-bold text-center mb-4">
//                 Request Charity Role
//             </h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Organization Name */}
//                 <div>
//                     {/* 👇 Name (prefilled from user, but editable if needed) */}
//                      <label className="label">
//                         <span className="label-text">Name</span>
//                     </label>
//                     <input
//                         type="text"
//                         defaultValue={user?.displayName || ""}
//                         {...register("name", { required: true })}
//                         placeholder="Your Name"
//                         className="input input-bordered w-full"
//                         readOnly={!!user?.displayName} // make readonly if from auth
//                     />

//                     {/* 👇 Email (prefilled from user, but editable if needed) */}
//                      <label className="label">
//                         <span className="label-text">Email</span>
//                     </label>
//                     <input
//                         type="email"
//                         defaultValue={user?.email || ""}
//                         {...register("email", { required: true })}
//                         placeholder="Your Email"
//                         className="input input-bordered w-full"
//                         readOnly={!!user?.email}
//                     />



//                     <label className="label">
//                         <span className="label-text">Organization Name</span>
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="e.g. Helping Hands"
//                         className="input input-bordered w-full"
//                         {...register("organizationName", { required: true })}
//                     />
//                     {errors.organizationName && (
//                         <p className="text-error text-sm mt-1">Organization name is required</p>
//                     )}
//                 </div>

//                 {/* Mission Statement */}
//                 <div>
//                     <label className="label">
//                         <span className="label-text">Mission Statement</span>
//                     </label>
//                     <textarea
//                         placeholder="Describe your mission"
//                         className="textarea textarea-bordered w-full"
//                         {...register("mission", { required: true })}
//                     />
//                     {errors.mission && (
//                         <p className="text-error text-sm mt-1">Mission statement is required</p>
//                     )}
//                 </div>

//                 {/* Payment Amount (fixed $25) */}
//                 <div>
//                     <label className="label">
//                         <span className="label-text">Payment Amount</span>
//                     </label>
//                     <input
//                         type="number"
//                         value={25}
//                         readOnly
//                         className="input input-bordered w-full"
//                         {...register("amount")}
//                     />
//                     <p className="text-xs text-gray-500">One-time fee for becoming a Charity partner</p>
//                 </div>

//                 {/* Submit Button */}
//                 <button type="submit" className="btn btn-primary w-full">
//                     Pay & Request Role
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default BeCharity;
















































import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router";

const BeCharity = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [charityRequest, setCharityRequest] = useState(null); // holds the request from DB
    const [loading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const axiosSecure = useAxiosSecure();


    // 👇 Fetch existing request for this user when component loads
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const { data } = await axiosSecure.get(`/api/charity-requests/${user?.email}`);
                if (data) {
                    setCharityRequest(data);
                }
            } catch (err) {
                console.error("No request found yet", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchRequest();
        }
    }, [user?.email, axiosSecure]);
    const onSubmit = async (data) => {
        const charityData = {
            name: user?.displayName || data.name,
            email: user?.email || data.email,
            organizationName: data.organizationName,
            mission: data.mission,
            status: "Pending",
            paymentStatus: "Unpaid", // 👈 new field
            createdAt: new Date(),
        };
        try {
            const token = localStorage.getItem("token");
            const res = await axiosSecure.post(
                "api/charity-requests",
                charityData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Charity request submitted!");
            reset();
            setCharityRequest(res.data); // set state immediately
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit request");
        }
    };


    if (loading) return <p className="text-center">Loading...</p>;



    return (
        <div className="max-w-lg mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-4">Request Charity Role</h2>

            {!charityRequest ? (
                // Show request form if no request exists yet
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={user?.displayName || ""}
                            {...register("name", { required: true })}
                            placeholder="Your Name"
                            className="input input-bordered w-full"
                            readOnly={!!user?.displayName}
                        />

                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email || ""}
                            {...register("email", { required: true })}
                            placeholder="Your Email"
                            className="input input-bordered w-full"
                            readOnly={!!user?.email}
                        />

                        <label className="label">
                            <span className="label-text">Organization Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Helping Hands"
                            className="input input-bordered w-full"
                            {...register("organizationName", { required: true })}
                        />
                        {errors.organizationName && (
                            <p className="text-error text-sm mt-1">Organization name is required</p>
                        )}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Mission Statement</span>
                        </label>
                        <textarea
                            placeholder="Describe your mission"
                            className="textarea textarea-bordered w-full"
                            {...register("mission", { required: true })}
                        />
                        {errors.mission && (
                            <p className="text-error text-sm mt-1">Mission statement is required</p>
                        )}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Payment Amount</span>
                        </label>
                        <input
                            type="number"
                            value={25}
                            readOnly
                            className="input input-bordered w-full"
                            {...register("amount")}
                        />
                        <p className="text-xs text-gray-500">One-time fee for becoming a Charity partner</p>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Request Role
                    </button>
                </form>
            ) : (
                // If request already exists
                <div className="text-center">
                    <p className="mb-4">Your request is submitted ✅</p>
                    {charityRequest.paymentStatus === "Unpaid" ? (
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/dashboard/payment/${charityRequest._id}`)} // 👈 send requestId
                        >
                            Pay Now
                        </button>
                    ) : (
                        <p className="text-green-600 font-bold">Payment Completed 🎉</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BeCharity;
