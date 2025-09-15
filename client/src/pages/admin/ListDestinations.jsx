import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const ListDestinations = () => {
  const { axios, getToken } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [destinations, setdestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllDestination = async () => {
      try {
        if (import.meta.env.VITE_ENABLE_MOCK_AUTH === "true") {
          setdestinations([]);
          setLoading(false);
          return;
        }
        const { data } = await axios.get("/api/admin/all-shows", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        setShows(data.shows);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false); // Set loading to false even on error
      }
    };

    // Always call getAllShow, regardless of user state for admin panel
    getAllDestination();
  }, [axios, getToken]);

  return !loading ? (
    <>
      <Title text1="List" text2="Routes" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">Route Name</th>
              <th className="p-4 font-medium">Departure Time</th>
              <th className="p-4 font-medium">Total Bookings</th>
              <th className="p-4 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows && shows.length > 0 ? (
              shows.map((show, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <td className="p-4 pl-6 text-white">{show.movie.title}</td>
                  <td className="p-4 text-white">{dateFormat(show.showDateTime)}</td>
                  <td className="p-4 text-white">
                    {Object.keys(show.occupiedSeats).length}
                  </td>
                  <td className="p-4 text-white">
                    {currency} {Object.keys(show.occupiedSeats).length * show.showPrice}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-white/70">
                  No routes found. Routes will appear here once they are added.
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

export default ListDestinations;
