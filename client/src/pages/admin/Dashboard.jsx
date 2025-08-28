import {
  ChartLineIcon,
  CircleDollarSignIcon,
  RouteIcon,
  UsersIcon,
} from "lucide-react";

const Dashboard = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Future sections can be added here */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <p className="text-white/70 text-center py-8">
            Recent activity data will be displayed here when connected to the database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
