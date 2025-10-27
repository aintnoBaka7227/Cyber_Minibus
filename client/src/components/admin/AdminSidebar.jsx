import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Routes", path: "/admin/add-routes", icon: PlusSquareIcon },
    { name: "List Routes", path: "/admin/list-routes", icon: ListIcon },
    { name: "List Bookings", path: "/admin/list-bookings", icon: ListCollapseIcon },
    { name: "List Users", path: "/admin/list-users", icon: UsersIcon },
  ];

  return (
    <div className="h-full md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <div className="h-12 md:h-16 w-12 md:w-16 rounded-full mx-auto bg-white/10 flex items-center justify-center">
        <UserIcon className="h-6 md:h-8 w-6 md:w-8 text-white" />
      </div>
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
