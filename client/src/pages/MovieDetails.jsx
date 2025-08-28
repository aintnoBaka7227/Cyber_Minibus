import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon, MapPin, ChevronDown } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { destinations } from "../assets/dummy";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Start from ...");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = [
    "Adelaide CBD",
    "Barossa Valley",
    "Clare Valley",
    "Flinders Range",
    "Hahndorf",
    "Mount Gambier",
    "Port Elliot",
    "Robe",
    "Whyalla"
  ];

  const {
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
  } = useAppContext();

  useEffect(() => {
    const getDestination = () => {
      const found = destinations.find(dest => dest._id === id);
      if (found) {
        setDestination(found);
      }
    };
    getDestination();
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

  // const handleFavorite = async () => {
  //   try {
  //     if (!user) return toast.error("Please login to proceed");

  //     const { data } = await axios.post(
  //       "/api/user/update-favorite",
  //       { movieId: id },
  //       { headers: { Authorization: `Bearer ${await getToken()}` } }
  //     );

  //     if (data.success) {
  //       await fetchFavoriteMovies();
  //       toast.success(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 text-black"
            >
              Book Trip
            </a>
          </div>
        </div>
      </div>

      {/* Location Selection Section */}
      <div className="mt-20 mb-32">
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
                {destination.tripTemplates[0].startPoints.map((location) => (
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
            dateTime={destination.tripTemplates[0].departureTimes}
            id={id}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      {/* You May Also Like Section */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {destinations.filter(dest => dest._id !== id).slice(0, 4).map((dest, index) => (
          <MovieCard key={index} destination={dest} />
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
    <div>Loading...</div>

};

// TODO: Continue with the rest of the Movie Details, for example Date and Time selection

export default MovieDetails;
