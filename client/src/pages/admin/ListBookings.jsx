import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { bookingApi } from "../../api";
import toast from "react-hot-toast";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingApi.getAllBookings();
        
        if (data.success) {
          setBookings(data.bookings || []);
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

    getAllBookings();
  }, []);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">User</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Seats</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings && bookings.length > 0 ? (
              bookings.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <td className="p-4 pl-6 text-white">
                    {item.userID?.username || item.userID?.email || 'N/A'}
                  </td>
                  <td className="p-4 text-white">
                    {item.tripInstanceID?.tripTemplateID?.name || 'N/A'}
                  </td>
                  <td className="p-4 text-white">
                    {item.tripInstanceID?.date 
                      ? `${new Date(item.tripInstanceID.date).toLocaleDateString()} ${item.tripInstanceID.time}`
                      : 'N/A'}
                  </td>
                  <td className="p-4 text-white">
                    {item.seats?.join(", ") || 'N/A'}
                  </td>
                  <td className="p-4 text-white">
                    {currency} {(item.seats?.length || 0) * (item.tripInstanceID?.tripTemplateID?.price || 0)}
                  </td>
                  <td className="p-4 text-white">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                      item.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-white/70">
                  No bookings found. Bookings will appear here once customers make reservations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
