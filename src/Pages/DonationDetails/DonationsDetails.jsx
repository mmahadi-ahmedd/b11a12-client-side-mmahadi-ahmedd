import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const DonationsDetails = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [requestData, setRequestData] = useState({ description: "", pickupTime: "" });
  const {user} = useAuth();

  const axiosSecure = useAxiosSecure();

  // ✅ Fetch donation details
  const fetchDonation = async () => {
    try {
      const { data } = await axiosSecure.get(`/api/donations/${id}`);
      setDonation(data);
    } catch (err) {
      toast.error("Failed to fetch donation details");
    }
  };

  // ✅ Fetch reviews for this donation
  const fetchReviews = async () => {
    try {
      const { data } = await axiosSecure.get(`/api/donations/${id}/reviews`);
      setReviews(data);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    if (id) {
      fetchDonation();
      fetchReviews();
    }
  }, [id]);

  // ✅ Request donation (Charity only)
  const handleRequest = async () => {
    if (!user || user.role !== "Charity")
      return toast.error("Only charities can request donations");

    try {
      await axiosSecure.post(`/api/donations/${id}/request`, {
        charityName: user.name,
        charityEmail: user.email,
        ...requestData,
      });
      toast.success("Donation request submitted");
      setRequestData({ description: "", pickupTime: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    }
  };

  // ✅ Add to favorites
  const handleFavorite = async () => {
    
    if (!user) return toast.error("Please login to add favorites");

    try {
      await axiosSecure.post(`/api/donations/${id}/favorite`, {
        userEmail: user.email,
      });
      toast.success("Added to favorites");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add favorite");
    }
  };

  // ✅ Add review
  const handleReview = async (review) => {
    if (!user) return toast.error("Please login to review");

    try {
      await axiosSecure.post(`/api/donations/${id}/review`, {
        reviewerName: user.name,
        reviewerEmail: user.email,
        ...review,
      });
      toast.success("Review added");
      fetchReviews(); // refresh list
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  if (!donation) return <p className="text-center mt-10">Loading donation details...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">{donation.title}</h2>
      <img
        src={donation.image || "/default-donation.jpg"}
        alt={donation.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p><strong>Restaurant:</strong> {donation.restaurantName}</p>
      <p><strong>Location:</strong> {donation.location}</p>
      <p><strong>Status:</strong> {donation.status}</p>
      <p><strong>Quantity:</strong> {donation.quantity} {donation.unit || "kg"}</p>
      <p><strong>Description:</strong> {donation.description}</p>

      {/* Favorite Button */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleFavorite}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Add to Favorites
        </button>
      </div>

      {/* Charity Request Form */}
      <div className="mt-6 border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Request this Donation (Charity Only)</h3>
        <textarea
          placeholder="Request description"
          className="border w-full p-2 mb-2"
          value={requestData.description}
          onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
        />
        <input
          type="datetime-local"
          className="border w-full p-2 mb-2"
          value={requestData.pickupTime}
          onChange={(e) => setRequestData({ ...requestData, pickupTime: e.target.value })}
        />
        <button
          onClick={handleRequest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Request
        </button>
      </div>

      {/* Reviews */}
      <div className="mt-6 border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b py-2">
              <p className="font-semibold">{review.reviewerName}</p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.description}</p>
            </div>
          ))
        )}
        {/* Add Review */}
        <AddReviewForm onSubmit={handleReview} />
      </div>
    </div>
  );
};

const AddReviewForm = ({ onSubmit }) => {
  const [review, setReview] = useState({ description: "", rating: 5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review);
    setReview({ description: "", rating: 5 });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <textarea
        className="border p-2"
        placeholder="Write your review"
        value={review.description}
        onChange={(e) => setReview({ ...review, description: e.target.value })}
        required
      />
      <select
        value={review.rating}
        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Review
      </button>
    </form>
  );
};

export default DonationsDetails;
