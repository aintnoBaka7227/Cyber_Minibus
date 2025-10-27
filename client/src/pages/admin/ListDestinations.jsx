import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { destinationApi } from "../../api";
import toast from "react-hot-toast";

const ListDestinations = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationApi.getAllDestinations();
        
        if (data.success) {
          setDestinations(data.destinations || []);
        } else {
          toast.error("Failed to load destinations");
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        toast.error(error.response?.data?.message || "Failed to load destinations");
      } finally {
        setLoading(false);
      }
    };

    getAllDestinations();
  }, []);

  // Calculate total bookings and earnings for each destination
  // This would ideally come from backend, but for now we'll show placeholder data
  const getDestinationStats = (destination) => {
    // Get the first trip template for display
    const tripTemplate = destination.tripTemplates?.[0];
    const departureTime = tripTemplate?.departureTimes?.[0] || "N/A";
    
    // These would come from actual booking data in a real scenario
    // For now, we'll show placeholders or you can fetch from backend
    return {
      departureTime,
      totalBookings: 0, // TODO: Fetch from backend
      earnings: 0 // TODO: Fetch from backend
    };
  };

  return !loading ? (
    <>
      <Title text1="List" text2="Routes" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">Route Name</th>
              <th className="p-4 font-medium">Departure Time</th>
              <th className="p-4 font-medium">Total Booking</th>
              <th className="p-4 font-medium">Earning</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {destinations && destinations.length > 0 ? (
              destinations.map((destination) => {
                const stats = getDestinationStats(destination);
                return (
                  <tr
                    key={destination._id}
                    className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <td className="p-4 pl-6 text-white">{destination.name}</td>
                    <td className="p-4 text-white">
                      {destination.tripTemplates?.[0]?.departureTimes?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4 text-white">{stats.totalBookings}</td>
                    <td className="p-4 text-white">
                      {currency}{stats.earnings}
                    </td>
                  </tr>
                );
              })
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
