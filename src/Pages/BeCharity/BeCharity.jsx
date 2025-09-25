import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BeCharity = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token"); // JWT saved on login
            const res = await axiosSecure.post(
                "api/charity-requests",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(res.data.message || "Charity request submitted!");
            reset();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit request");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-4">
                Request Charity Role
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Organization Name */}
                <div>
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

                {/* Mission Statement */}
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

                {/* Payment Amount (fixed $25) */}
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

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-full">
                    Pay & Request Role
                </button>
            </form>
        </div>
    );
};

export default BeCharity;