import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  UsersIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Routes", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Routes", path: "/admin/list-shows", icon: ListIcon },
    { name: "List Bookings", path: "/admin/list-bookings", icon: ListCollapseIcon },
    { name: "List Users", path: "/admin/list-users", icon: UsersIcon },
  ];

  return (
    <div className="h-full md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-12 md:h-16 w-12 md:w-16 rounded-full mx-auto border-2 border-[#ABD5EA]"
        src={assets.profile}
        alt="admin profile"
      />
      <p className="mt-3 text-lg max-md:hidden font-semibold text-white">
        Admin
      </p>
      
      <div className="w-full flex-1 mt-8">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-3 w-full py-3 min-md:pl-8 text-white hover:bg-[#ABD5EA]/10 transition-colors ${
                isActive && "bg-[#ABD5EA]/20 text-[#ABD5EA] border-r-4 border-[#ABD5EA]"
              }`
            }
          >
            <>
              <link.icon className="w-5 h-5" />
              <p className="max-md:hidden font-medium">{link.name}</p>
            </>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
