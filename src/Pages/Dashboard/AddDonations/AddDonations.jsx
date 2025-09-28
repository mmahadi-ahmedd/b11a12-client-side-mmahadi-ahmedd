import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import axios from "axios";


const AddDonations = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
    const [profilePic, setProfilePic] = useState('');

    // 📌 Submit form
    const onSubmit = async (data) => {
        try {
            const donationData = {
                title: data.title,
                foodType: data.foodType,
                quantity: data.quantity,
                // merge pickup time into one string
                pickupTime: `${data.pickupFrom} - ${data.pickupTo}`,
                restaurantName: user?.displayName || "Unknown",
                restaurantEmail: user?.email,
                location: data.location,
                image: profilePic, // ✅ use uploaded image URL
            };

            await axiosSecure.post("/api/donations", donationData);
            toast.success("Donation added successfully! Pending for admin approval.");
            reset();
            setProfilePic(""); // clear image after submit
        } catch (err) {
            toast.error("Failed to add donation");
        }
    };


    // 📌 Handle image upload to imgbb
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        try {
            const imageURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

            const res = await axios.post(imageURL, formData); // use normal axios here
            setProfilePic(res.data.data.url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Image upload failed", error);
            toast.error("Image upload failed");
        }
    };




    return (
        <div className="flex justify-center mt-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg shadow-lg rounded-2xl p-6 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Add Donation</h2>

                <input
                    {...register("title", { required: true })}
                    placeholder="Donation Title"
                    className="input input-bordered w-full"
                />

                <select {...register("foodType", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Food Type</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Cooked Meal">Cooked Meal</option>
                </select>

                <input
                    {...register("quantity", { required: true })}
                    placeholder="Quantity (kg or portions)"
                    type="number"
                    className="input input-bordered w-full"
                />

                <div className="flex gap-2">
                    <input
                        {...register("pickupFrom", { required: true })}
                        type="time"
                        className="input input-bordered w-full"
                    />
                    <input
                        {...register("pickupTo", { required: true })}
                        type="time"
                        className="input input-bordered w-full"
                    />
                </div>

                <input
                    value={user?.displayName || ""}
                    
                    className="input input-bordered w-full "
                />

                <input
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full "
                />

                <input
                    {...register("location", { required: true })}
                    placeholder="Restaurant Location"
                    className="input input-bordered w-full"
                />


                {/* File Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                />

                {/* Preview uploaded image */}
                {profilePic && (
                    <img src={profilePic} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-lg" />
                )}


                <button type="submit" className="btn btn-primary w-full">
                    Add Donation
                </button>
            </form>
        </div>
    );
};

export default AddDonations;