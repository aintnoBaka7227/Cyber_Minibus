import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/admin/Title";
import { PlusIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { destinationApi } from "../../api";

const AddDestinations = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    teaser: "",
    description: "",
    rating: 4.0,
    mainphoto: "",
  });

  const [tripTemplate, setTripTemplate] = useState({
    startPoints: [{ name: "" }],
    departureTimes: [""],
    price: "",
    seatLayout: generateDefaultSeatLayout(),
  });

  const [submitting, setSubmitting] = useState(false);

  // Generate default bus seat layout (8 rows × 4 columns)
  function generateDefaultSeatLayout() {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = [1, 2, 3, 4];
    const seats = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        seats.push(`${row}${col}`);
      });
    });
    return seats;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartPointChange = (index, value) => {
    const newStartPoints = [...tripTemplate.startPoints];
    newStartPoints[index] = { name: value };
    setTripTemplate((prev) => ({ ...prev, startPoints: newStartPoints }));
  };

  const addStartPoint = () => {
    setTripTemplate((prev) => ({
      ...prev,
      startPoints: [...prev.startPoints, { name: "" }],
    }));
  };

  const removeStartPoint = (index) => {
    if (tripTemplate.startPoints.length > 1) {
      const newStartPoints = tripTemplate.startPoints.filter((_, i) => i !== index);
      setTripTemplate((prev) => ({ ...prev, startPoints: newStartPoints }));
    }
  };

  const handleDepartureTimeChange = (index, value) => {
    const newTimes = [...tripTemplate.departureTimes];
    newTimes[index] = value;
    setTripTemplate((prev) => ({ ...prev, departureTimes: newTimes }));
  };

  const addDepartureTime = () => {
    setTripTemplate((prev) => ({
      ...prev,
      departureTimes: [...prev.departureTimes, ""],
    }));
  };

  const removeDepartureTime = (index) => {
    if (tripTemplate.departureTimes.length > 1) {
      const newTimes = tripTemplate.departureTimes.filter((_, i) => i !== index);
      setTripTemplate((prev) => ({ ...prev, departureTimes: newTimes }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !tripTemplate.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (tripTemplate.startPoints.some((sp) => !sp.name.trim())) {
      toast.error("Please fill in all start point names");
      return;
    }

    if (tripTemplate.departureTimes.some((time) => !time.trim())) {
      toast.error("Please fill in all departure times");
      return;
    }

    try {
      setSubmitting(true);

      // Generate MongoDB-compatible ObjectId (24 hex characters)
      const generateObjectId = () => {
        const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return timestamp + randomHex() + randomHex();
      };

      // Prepare trip template with generated ObjectIds for startPoints
      const preparedTripTemplate = {
        startPoints: tripTemplate.startPoints.map((sp) => ({
          id: generateObjectId(),
          name: sp.name,
        })),
        departureTimes: tripTemplate.departureTimes,
        price: Number(tripTemplate.price),
        seatLayout: tripTemplate.seatLayout,
      };

      const payload = {
        ...formData,
        rating: Number(formData.rating),
        tripTemplates: [preparedTripTemplate],
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      const data = await destinationApi.addDestination(payload);

      if (data.success) {
        toast.success("Destination added successfully!");
        navigate("/admin/list-routes");
      } else {
        toast.error(data.message || "Failed to add destination");
      }
    } catch (error) {
      console.error("Error adding destination:", error);
      toast.error(error.response?.data?.message || "Failed to add destination");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <Title text1="Add" text2="Routes" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Destination Information */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Destination Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Destination Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Hahndorf, Port Elliot"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Teaser (Short Description)
              </label>
              <input
                type="text"
                name="teaser"
                value={formData.teaser}
                onChange={handleInputChange}
                placeholder="e.g., Picturesque town with German heritage"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the destination..."
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Main Photo URL</label>
                <input
                  type="url"
                  name="mainphoto"
                  value={formData.mainphoto}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Template */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Trip Template</h2>

          {/* Start Points */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Start Points <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {tripTemplate.startPoints.map((sp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={sp.name}
                    onChange={(e) => handleStartPointChange(index, e.target.value)}
                    placeholder="e.g., Adelaide CBD"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    required
                  />
                  {tripTemplate.startPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStartPoint(index)}
                      className="px-3 py-2 bg-red-600/20 border border-red-600 rounded-lg text-red-500 hover:bg-red-600/30"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStartPoint}
              className="mt-2 px-4 py-2 bg-primary/20 border border-primary rounded-lg text-primary hover:bg-primary/30 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Start Point
            </button>
          </div>

          {/* Departure Times */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Departure Times <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {tripTemplate.departureTimes.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleDepartureTimeChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                    required
                  />
                  {tripTemplate.departureTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDepartureTime(index)}
                      className="px-3 py-2 bg-red-600/20 border border-red-600 rounded-lg text-red-500 hover:bg-red-600/30"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDepartureTime}
              className="mt-2 px-4 py-2 bg-primary/20 border border-primary rounded-lg text-primary hover:bg-primary/30 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Departure Time
            </button>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Price per Seat <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg w-fit">
              <span className="text-gray-400">{currency}</span>
              <input
                type="number"
                value={tripTemplate.price}
                onChange={(e) =>
                  setTripTemplate((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-32 bg-transparent text-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add Destination"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/list-routes")}
            className="px-8 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDestinations;
