import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Loading from "../../components/Loading";

const Layout = () => {
  const { isAdmin, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-admin authenticated users away from admin routes
    if (isAuthenticated && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isAuthenticated, navigate]);

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen pt-20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-6 md:px-10 py-8">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Layout;
