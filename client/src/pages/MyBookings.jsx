import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { bookings as mockBookings } from "../assets/dummy";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      // Using mock data for development - replace with real API call later
      setBookings(mockBookings);
      setIsLoading(false);
      
      // Real API call (commented out for now)
      /*
      const { axios, getToken } = useAppContext();
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
      */
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate user being logged in for development
    getMyBookings();
    
    // Real implementation (commented out for now)
    /*
    const { user } = useAppContext();
    if (user) {
      getMyBookings();
    }
    */
  }, []);

  const handleCancelBooking = (bookingId) => {
    // For now, just remove from state - implement real cancellation later
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking._id !== bookingId)
    );
    console.log(`Booking ${bookingId} cancelled`);
  };

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-2xl font-semibold mb-8 text-white">My Bookings</h1>

      <div className="space-y-6 max-w-4xl">
        {bookings.map((booking, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 gap-6"
          >
            {/* Left side - Image and trip info */}
            <div className="flex gap-4">
              <img
                src={booking.destination.image}
                alt={booking.destination.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {booking.destination.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {booking.destination.duration}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {booking.tripDate} • {booking.tripTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Price, booking details and status */}
            <div className="flex flex-col items-end justify-between flex-1">
              <div className="text-right space-y-2">
                <p className="text-xl font-bold text-white">
                  {currency}{booking.amount}
                </p>
                <div className="text-sm space-y-1">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Total Tickets:</span>{" "}
                    <span className="font-semibold">{booking.totalTickets}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Seat Number:</span>{" "}
                    <span className="font-semibold">{booking.seats.join(", ")}</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                {booking.canCancel ? (
                  <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                ) : (
                  <div className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-medium">
                    Successful
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
