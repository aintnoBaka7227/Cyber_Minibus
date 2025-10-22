import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddDestinations from "./pages/admin/AddDestinations_new";
import ListBookings from "./pages/admin/ListBookings";
import ListUsers from "./pages/admin/ListUsers";
import Loading from "./components/Loading";
import ListDestinations from "./pages/admin/ListDestinations";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<Destinations />} />
        <Route path="/routes/:id" element={<DestinationDetails />} />
        <Route path="/routes/:id/:date" element={<SeatLayout />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/my-bookings" element={<MyBookings />}/>
        <Route path="/my-profile" element={<UserProfile />}/>
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-routes" element={<AddDestinations />} />
          <Route path="list-routes" element={<ListDestinations />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="list-users" element={<ListUsers />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
