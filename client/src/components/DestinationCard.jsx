import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination }) => {
  console.log(destination)
  if (!destination) return <div>Loading...</div>;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  // No need for image_base_url, use destination.mainphoto directly

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full">
      <img
        onClick={() => {
          navigate(`/routes/${destination._id}`);
          scrollTo(0, 0);
        }}
        src={destination.mainphoto}
        alt={destination.name}
        className="rounded-lg h-40 sm:h-48 md:h-52 w-full object-cover object-center cursor-pointer"
      />

  <p className="font-semibold mt-2 truncate">{destination.name}</p>
  <p className="text-sm text-gray-400 mt-2">{destination.teaser}</p>

  {/* Additional info can be added here if needed, e.g. description, price, etc. */}

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/routes/${destination._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-black"
        >
          Book Trip
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {destination.rating ? destination.rating.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
