import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import DestinationCard from "./DestinationCard";
import { destinations } from "../assets/dummy";

const FeaturedSection = () => {
  const navigate = useNavigate();
   
  //const { shows } = useAppContext();

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Current Journeys</p>
        <button
          onClick={() => {
            navigate("/routes");
            scrollTo(0, 0);
          }}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 justify-items-center'>
        {destinations.map((destination) => {
          console.log('FeaturedSection destination:', destination);
          return <DestinationCard key={destination._id} destination={destination} />;
        })}
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
  );
};

export default FeaturedSection;
