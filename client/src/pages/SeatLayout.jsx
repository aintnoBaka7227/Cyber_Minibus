import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { destinationApi, bookingApi, tripApi } from "../api";

const SeatLayout = () => {
  // Bus seating arrangement: 8 rows (A-H), 4 columns (1-4)
  const busRows = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const { id, date: urlDate } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [destination, setDestination] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { user } = useAppContext();

  // Get selected date from URL if available
  useEffect(() => {
    if (urlDate) {
      // Date from URL parameter
      setSelectedTime({ 
        time: null,
        date: urlDate
      });
    }
  }, [urlDate]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      toast.error("Please select a time first!");
      // Scroll to the time selection section
      const timeSection = document.querySelector('.w-60');
      if (timeSection) {
        timeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Render bus row with aisle
  const renderBusRow = (row) => (
    <div key={row} className="flex items-center gap-4 mb-3">
      <span className="text-sm font-medium w-4">{row}</span>
      
      {/* Left side seats (1, 2) */}
      <div className="flex gap-2">
        {[1, 2].map((seatNum) => {
          const seatId = `${row}${seatNum}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-10 w-10 rounded border-2 border-primary/60 cursor-pointer text-xs font-medium transition-all ${
                selectedSeats.includes(seatId) 
                  ? "bg-primary text-white border-primary" 
                  : "hover:bg-primary/20"
              } ${occupiedSeats.includes(seatId) && "opacity-50 cursor-not-allowed bg-red-200"}`}
              disabled={occupiedSeats.includes(seatId)}
            >
              {seatId}
            </button>
          );
        })}
      </div>

      {/* Aisle */}
      <div className="w-8 flex justify-center">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Right side seats (3, 4) */}
      <div className="flex gap-2">
        {[3, 4].map((seatNum) => {
          const seatId = `${row}${seatNum}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-10 w-10 rounded border-2 border-primary/60 cursor-pointer text-xs font-medium transition-all ${
                selectedSeats.includes(seatId) 
                  ? "bg-primary text-white border-primary" 
                  : "hover:bg-primary/20"
              } ${occupiedSeats.includes(seatId) && "opacity-50 cursor-not-allowed bg-red-200"}`}
              disabled={occupiedSeats.includes(seatId)}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      if (!selectedTime?.time || !selectedSeats.length) {
        return toast.error("Please select a time and seats");
      }

      // Get date from URL params
      const bookingDate = urlDate || selectedTime.date;
      
      if (!bookingDate || !destination?.tripTemplates?.[0]?._id) {
        return toast.error("Please select date and time");
      }

      // Create booking with trip template info
      // Backend will create/find trip instance
      const bookingData = {
        // Server expects `templateId` when not providing a `tripInstanceID`
        templateId: destination.tripTemplates[0]._id,
        date: bookingDate,
        time: selectedTime.time,
        seats: selectedSeats,
      };

      const data = await bookingApi.createBooking(bookingData);
      
      if (data.success) {
        toast.success(`Successfully booked seats: ${selectedSeats.join(", ")}`);
        
        // Navigate to bookings page
        setTimeout(() => {
          navigate("/my-bookings");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        setLoading(true);
        const data = await destinationApi.getDestinationDetails(id);
        if (data.success) {
          setDestination(data.destination);
        } else {
          toast.error("Failed to load destination");
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        toast.error(error.response?.data?.message || "Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [id]);

  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        if (!selectedTime?.time) return;
        const templateId = destination?.tripTemplates?.[0]?._id;
        const date = urlDate || selectedTime?.date; // prefer URL date if present
        if (!templateId || !date) return;

        const data = await tripApi.getInstanceByParams({ templateId, date, time: selectedTime.time });
        if (data?.success) {
          setOccupiedSeats(Array.isArray(data.bookedSeats) ? data.bookedSeats : []);
        }
      } catch (err) {
        // Silently ignore and keep current state to avoid UX noise
        console.error("Failed to fetch occupied seats", err);
      }
    };

    fetchOccupiedSeats();
  }, [selectedTime, destination, urlDate]);

  if (loading) {
    return <Loading />;
  }

  return destination ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {destination.tripTemplates && destination.tripTemplates[0]?.departureTimes?.map((time) => (
            <div
              key={time}
              onClick={() => setSelectedTime({ time })}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === time
                  ? "bg-primary text-black"
                  : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Seats Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-8">Select your seat</h1>
        
        {/* Bus Layout */}
        <div className="bg-white/5 border border-primary/20 rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            {/* Driver Section Indicator - Australian Right Side */}
            <div className="mb-6 w-full flex justify-end pr-4">
              <div className="text-center">
                <div className="w-16 h-8 bg-gray-600 rounded-t-lg mb-2"></div>
                <p className="text-xs text-gray-400">DRIVER</p>
              </div>
            </div>
            
            {/* Bus Seats */}
            <div className="space-y-1">
              {busRows.map((row) => renderBusRow(row))}
            </div>
            
            {/* Seat Legend */}
            <div className="flex items-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary/60 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-200 border-2 border-red-300 rounded opacity-50"></div>
                <span>Occupied</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={bookTickets}
          className="flex items-center gap-1 mt-8 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 text-black"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
