import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        if (import.meta.env.VITE_ENABLE_MOCK_AUTH === "true") {
          setBookings([]);
          setIsLoading(false);
          return;
        }
        const { data } = await axios.get("/api/admin/all-bookings", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
      setIsLoading(false);
    };

    getAllBookings();
  }, [axios, getToken]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">User Name</th>
              <th className="p-4 font-medium">Route Name</th>
              <th className="p-4 font-medium">Departure Time</th>
              <th className="p-4 font-medium">Seats</th>
              <th className="p-4 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings && bookings.length > 0 ? (
              bookings.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <td className="p-4 pl-6 text-white">{item.user.name}</td>
                  <td className="p-4 text-white">{item.show.movie.title}</td>
                  <td className="p-4 text-white">{dateFormat(item.show.showDateTime)}</td>
                  <td className="p-4 text-white">
                    {Object.keys(item.bookedSeats)
                      .map((seat) => item.bookedSeats[seat])
                      .join(", ")}
                  </td>
                  <td className="p-4 text-white">
                    {currency} {item.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-white/70">
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
