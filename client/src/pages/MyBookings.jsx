import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { userApi, bookingApi } from "../api";
import toast from "react-hot-toast";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    if (!user?._id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await userApi.getUserBookings(user._id);

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to load bookings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const data = await bookingApi.cancelBooking(bookingId);
      
      if (data.success) {
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        toast.success("Booking cancelled successfully");
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-2xl font-semibold mb-8 text-white">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No bookings found</p>
          <button
            onClick={() => window.location.href = "/routes"}
            className="mt-6 px-6 py-3 bg-primary text-black rounded-full hover:bg-primary-dull transition"
          >
            Browse Destinations
          </button>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col md:flex-row bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 gap-6"
            >
              {/* Left side - Image and trip info */}
              <div className="flex gap-4 flex-1">
                <img
                  src={booking.tripInstanceID?.tripTemplateID?.mainphoto || "/placeholder-image.jpg"}
                  alt={booking.tripInstanceID?.tripTemplateID?.name || "Destination"}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=200&h=200&fit=crop";
                  }}
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {booking.tripInstanceID?.tripTemplateID?.name || "Destination"}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {new Date(booking.tripInstanceID?.date).toLocaleDateString()} • {booking.tripInstanceID?.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Price, booking details and status */}
              <div className="flex flex-col items-end justify-between flex-1">
                <div className="text-right space-y-2">
                  <p className="text-xl font-bold text-white">
                    {currency}{(booking.seats?.length || 0) * (booking.tripInstanceID?.tripTemplateID?.price || 0)}
                  </p>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Total Tickets:</span>{" "}
                      <span className="font-semibold">{booking.seats?.length || 0}</span>
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Seat Number:</span>{" "}
                      <span className="font-semibold">{booking.seats?.join(", ") || "N/A"}</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  {booking.status === "pending" ? (
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : booking.status === "paid" ? (
                    <div className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-medium">
                      Confirmed
                    </div>
                  ) : (
                    <div className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-medium">
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
