import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { StarIcon, MapPin, ChevronDown } from "lucide-react";
import DateSelect from "../components/DateSelect";
import DestinationCard from "../components/DestinationCard";
import { useAppContext } from "../context/AppContext";
import { destinationApi } from "../api";
import toast from "react-hot-toast";

const DestinationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Start from ...");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [relatedDestinations, setRelatedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookTrip = () => {
    // Always scroll to location selection first
    const locationSection = document.querySelector('.location-selection-section');
    if (locationSection) {
      locationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };  
  
  useAppContext();

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        setLoading(true);
        const data = await destinationApi.getDestinationDetails(id);
        if (data.success) {
          setDestination(data.destination);
        } else {
          toast.error("Failed to load destination details");
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        toast.error(error.response?.data?.message || "Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllDestinations = async () => {
      try {
        const data = await destinationApi.getAllDestinations();
        if (data.success) {
          setRelatedDestinations(data.destinations.filter(dest => dest._id !== id));
        }
      } catch (error) {
        console.error("Error fetching related destinations:", error);
      }
    };

    fetchDestinationDetails();
    fetchAllDestinations();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return destination ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={destination.mainphoto}
          alt={destination.name}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {destination.name}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {destination.rating ? destination.rating.toFixed(1) : "N/A"} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {destination.description}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              onClick={handleBookTrip}
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 text-black"
            >
              Book Trip
            </button>
          </div>
        </div>
      </div>

      {/* Location Selection Section */}
      <div className="mt-20 mb-32 location-selection-section">
        <p className="text-lg font-medium mb-8">Where do you want to start your journey?</p>
        
        <div className="flex items-center gap-3 max-w-md">
          <MapPin className="w-6 h-6 text-gray-400" />
          
          <div className="relative flex-1 location-dropdown">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-colors"
              style={{ backgroundColor: '#ABD5EA', color: 'black' }}
            >
              <span>{selectedLocation}</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {destination.tripTemplates && destination.tripTemplates[0]?.startPoints?.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-black hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Date and Time Selection Section */}
        <div id="dateSelect" className="mt-12">
          <DateSelect
            dateTime={destination.tripTemplates && destination.tripTemplates[0]?.departureTimes}
            id={id}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      {/* You May Also Like Section */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {relatedDestinations.slice(0, 4).map((dest) => (
          <DestinationCard key={dest._id} destination={dest} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/routes");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-black"
        >
          Show more
        </button>
      </div>
    </div>
  ) : 
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Loading destination...</p>
          </>
        ) : (
          <>
            <p className="text-xl text-gray-400">Destination not found</p>
            <button
              onClick={() => navigate("/routes")}
              className="mt-4 px-6 py-2 bg-primary text-black rounded-full hover:bg-primary-dull transition"
            >
              Back to Destinations
            </button>
          </>
        )}
      </div>
    </div>

};

// TODO: Continue with the rest of the Movie Details, for example Date and Time selection

export default DestinationDetails;
