import axios from "axios";
import TripTemplate from "../models/TripBooking.js";
import Trip from "../models/TripInstance.js";
import { inngest } from "../inngest/index.js";

// API to get now playing trips from TMDB API
export const getOnGoingTrips = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.thetripdb.org/3/trip/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );

    const trips = data.results;
    res.json({ success: true, trips: trips });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add a new show to the database
export const addTrip = async (req, res) => {
  try {
    const { tripId, showsInput, showPrice } = req.body;

    let trip = await TripTemplate.findById(tripId);

    if (!trip) {
      // Fetch trip details and credits from TMDB API
      const [tripDetailsResponse, tripCreditsResponse] = await Promise.all([
        axios.get(`https://api.thetripdb.org/3/trip/${tripId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),

        axios.get(`https://api.thetripdb.org/3/trip/${tripId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const tripApiData = tripDetailsResponse.data;
      const tripCreditsData = tripCreditsResponse.data;

      const tripDetails = {
        _id: tripId,
        title: tripApiData.title,
        overview: tripApiData.overview,
        poster_path: tripApiData.poster_path,
        backdrop_path: tripApiData.backdrop_path,
        genres: tripApiData.genres,
        casts: tripCreditsData.cast,
        release_date: tripApiData.release_date,
        original_language: tripApiData.original_language,
        tagline: tripApiData.tagline || "",
        vote_average: tripApiData.vote_average,
        runtime: tripApiData.runtime,
      };

      //   Add trip to the database
      trip = await TripTemplate.create(tripDetails);
    }

    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          trip: tripId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}, // Initialize with empty object
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Trip.insertMany(showsToCreate);
    }

    // Trigger Inngest event
    await inngest.send({
      name: "app/show.added",
      data: { tripTitle: trip.title },
    });

    res.json({ success: true, message: "Trip Added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows from the database
export const getTrips = async (req, res) => {
  try {
    const shows = await Trip.find({ showDateTime: { $gte: new Date() } })
      .populate("trip")
      .sort({ showDateTime: 1 });

    // filter unique shows
    const uniqueShows = new Set(shows.map((show) => show.trip));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    // get all upcoming shows for the trip
    const shows = await Trip.find({
      trip: tripId,
      showDateTime: { $gte: new Date() },
    });

    const trip = await TripTemplate.findById(tripId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, trip, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};