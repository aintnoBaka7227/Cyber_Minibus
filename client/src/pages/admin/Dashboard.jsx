import {
  ChartLineIcon,
  CircleDollarSignIcon,
  RouteIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { destinations } from "../../assets/dummy";
import DestinationCard from "../../components/DestinationCard";

const Dashboard = () => {
  const [showAll, setShowAll] = useState(false);
  
  // Placeholder data - will be replaced with real data when authentication is implemented
  const dashboardCards = [
    {
      title: "Total Bookings",
      value: "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: "$0",
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Routes",
      value: "0",
      icon: RouteIcon,
    },
    {
      title: "Total Users",
      value: "0",
      icon: UsersIcon,
    },
  ];

  // Show only first 4 destinations unless "Show More" is clicked
  const displayedDestinations = showAll ? destinations : destinations.slice(0, 4);

  return (
    <div className="p-6">
      {/* Dashboard Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-white">Admin </span>
          <span className="text-[#ABD5EA] font-bold">Dashboard</span>
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-sm font-medium opacity-80 mb-2">
                  {card.title}
                </h3>
                <p className="text-white text-2xl font-bold">{card.value}</p>
              </div>
              <div className="bg-[#ABD5EA]/20 p-3 rounded-lg">
                <card.icon className="w-6 h-6 text-[#ABD5EA]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Trips Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Active Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedDestinations.map((destination) => (
            <DestinationCard destination={destination} key={destination._id} />
          ))}
        </div>
        
        {/* Show More Button */}
        {destinations.length > 4 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-[#ABD5EA] text-black font-medium rounded-lg hover:bg-[#ABD5EA]/90 transition-colors"
            >
              {showAll ? "Show Less" : `Show More (${destinations.length - 4} more)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
