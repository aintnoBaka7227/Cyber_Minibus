import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-6 md:px-16 lg:px-36 h-screen max-w-7xl mx-auto'>
      {/* Content Section */}
      <div className="flex flex-col items-start justify-center gap-4 flex-1 max-w-lg lg:max-w-xl">
        <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold">
          CyberMinibus
        </h1>

        <p className="max-w-md text-gray-300">
          Your fast and easy ride across South Australia is just a tap away with CyberMinibus. Choose your destination and get you there comfortably with us.
        </p>
        <button
          onClick={() => navigate("/routes")}
          className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-black"
        >
          Explore your trip
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Image Section */}
      <div className="hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-lg">
        <img 
          src="/HomePage.webp" 
          alt="Highway landscape" 
          className="w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover rounded-3xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HeroSection;
