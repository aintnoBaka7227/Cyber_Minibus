import { useEffect, useState } from "react";
import BlurCircle from "../components/BlurCircle";
import DestinationCard from "../components/DestinationCard";
import { destinationApi } from "../api";
import toast from "react-hot-toast";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationApi.getAllDestinations();
        if (data.success) {
          setDestinations(data.destinations);
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

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Loading destinations...</p>
      </div>
    );
  }

  return destinations.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className="text-lg font-medium my-4">Current Journeys</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {destinations.map((destination) => (
          <DestinationCard destination={destination} key={destination._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No trips available</h1>
    </div>
  );
};

export default Destinations;
