import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DateSelect = ({ id, selectedLocation }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  // Generate all dates from today to end of year
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const allDates = [];
  let d = new Date(today);
  while (d <= endOfYear) {
    allDates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  // State for the start index of the 5-day window
  const [startIdx, setStartIdx] = useState(0);
  // Get the 5-day window
  const visibleDates = allDates.slice(startIdx, startIdx + 5);

  // Format a Date to local YYYY-MM-DD (no timezone shift)
  const toLocalYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const onDateClick = (date) => {
    if (!selectedLocation || selectedLocation === "Start from ...") {
      // Show popup message and scroll to location selection
      toast.error("Please select your starting point first!");
      const locationSection = document.querySelector('.location-selection-section');
      if (locationSection) {
        locationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    // Use local date string to avoid UTC shift (off-by-one)
    setSelected(toLocalYMD(date)); // YYYY-MM-DD
  };

  const onBookHandler = () => {
    if (!selectedLocation || selectedLocation === "Start from ...") {
      // Show popup message and scroll to location selection
      toast.error("Please select your starting point first!");
      const locationSection = document.querySelector('.location-selection-section');
      if (locationSection) {
        locationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!selected) {
      // Show popup message for date selection
      toast.error("Please select a date first!");
      return;
    }
    navigate(`/routes/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0" />
        <div>
          <p className="text-lg font-semibold">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <button
              onClick={() => setStartIdx(Math.max(0, startIdx - 1))}
              disabled={startIdx === 0}
              className="px-2 py-1 text-lg bg-transparent text-white disabled:opacity-30"
            >
              <ChevronLeftIcon width={28} />
            </button>
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {visibleDates.map((date) => (
                <button
                  onClick={() => onDateClick(date)}
                  key={toLocalYMD(date)}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${
                    selected === toLocalYMD(date)
                      ? "bg-primary text-white"
                      : "border border-primary/70"
                  }`}
                >
                  <span>{date.getDate()}</span>
                  <span>{date.toLocaleString("en-US", { month: "short" })}</span>
                </button>
              ))}
            </span>
            <button
              onClick={() => setStartIdx(Math.min(allDates.length - 5, startIdx + 1))}
              disabled={startIdx >= allDates.length - 5}
              className="px-2 py-1 text-lg bg-transparent text-white disabled:opacity-30"
            >
              <ChevronRightIcon width={28} />
            </button>
          </div>
        </div>
        <button
          onClick={onBookHandler}
          className="bg-primary text-black px-8 py-2 mt-6 rounded-full hover:bg-primary/90 transition-all cursor-pointer font-medium"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
