# Clerk Removal - Complete Structure Overview

## 📁 **FILE CHANGES STRUCTURE**

### **🗑️ REMOVED FILES**
```
server/models/Movie.js          ❌ DELETED
server/models/Show.js           ❌ DELETED  
server/routes/showRoutes.js     ❌ DELETED
```

### **🆕 NEW FILES CREATED**
```
server/routes/authRoutes.js           ✅ NEW
server/controllers/authController.js  ✅ NEW
server/middleware/jwtAuth.js          ✅ NEW
server/models/Destination.js          ✅ NEW
server/models/TripInstance.js         ✅ NEW
server/controllers/destinationController.js  ✅ NEW
server/controllers/tripInstanceController.js ✅ NEW
server/routes/destinationRoutes.js    ✅ NEW
server/routes/tripInstanceRoutes.js   ✅ NEW
client/src/pages/Login.jsx            ✅ NEW
client/src/pages/Register.jsx         ✅ NEW
```

### **📝 MODIFIED FILES**

#### **Package Dependencies**
```
📦 client/package.json
   ❌ REMOVED: "@clerk/clerk-react": "^5.31.9"
   
📦 server/package.json  
   ❌ REMOVED: "@clerk/express": "^1.7.1"
   ✅ ADDED: "bcryptjs": "^2.4.3"
   ✅ ADDED: "jsonwebtoken": "^9.0.2"
   
📦 package.json (root)
   ❌ REMOVED: "@clerk/clerk-react": "^5.43.0"
   ❌ REMOVED: "@clerk/nextjs": "^6.31.3"
```

#### **Database Configuration**
```
🗄️ server/configs/db.js
   BEFORE: await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
   AFTER:  await mongoose.connect(`${process.env.MONGODB_URI}/minibus`);
```

#### **Client-Side Changes**

**🔧 client/src/main.jsx**
```jsx
BEFORE:
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
</ClerkProvider>

AFTER:
<BrowserRouter>
  <AppProvider>
    <App />
  </AppProvider>
</BrowserRouter>
```

**🔧 client/src/context/AppContext.jsx**
```jsx
BEFORE:
import { useAuth, useUser } from "@clerk/clerk-react";
const { user } = useUser() || {};
const { getToken } = useAuth() || {};

AFTER:
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [destinations, setDestinations] = useState([]);
const [tripInstances, setTripInstances] = useState([]);

// NEW FUNCTIONS:
const login = async (email, password) => { /* ... */ };
const logout = () => { /* ... */ };
const register = async (userData) => { /* ... */ };
const fetchDestinations = async () => { /* ... */ };
const fetchTripInstances = async () => { /* ... */ };
```

**🔧 client/src/components/Navbar.jsx**
```jsx
BEFORE:
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
const { user } = useUser();
const { openSignIn } = useClerk();
const { favoriteMovies } = useAppContext();

{!user ? (
  <button onClick={openSignIn}>Login</button>
) : (
  <UserButton>
    <UserButton.MenuItems>
      <UserButton.Action label="My Bookings" />
    </UserButton.MenuItems>
  </UserButton>
)}

AFTER:
const { user, isAuthenticated, logout } = useAppContext();

{!isAuthenticated ? (
  <div className="flex gap-4">
    <button onClick={() => navigate("/login")}>Login</button>
    <button onClick={() => navigate("/register")}>Register</button>
  </div>
) : (
  <div className="relative">
    <button onClick={() => setShowUserMenu(!showUserMenu)}>
      <img src={user?.image} alt="Profile" />
      <span>{user?.name}</span>
    </button>
    {showUserMenu && (
      <div className="dropdown-menu">
        <button onClick={() => navigate("/my-bookings")}>My Bookings</button>
        <button onClick={logout}>Logout</button>
      </div>
    )}
  </div>
)}
```

#### **Server-Side Changes**

**🔧 server/server.js**
```javascript
BEFORE:
import { clerkMiddleware } from "@clerk/express";
import showRouter from "./routes/showRoutes.js";
app.use(clerkMiddleware());
app.use("/api/show", showRouter);

AFTER:
import destinationRouter from "./routes/destinationRoutes.js";
import tripInstanceRouter from "./routes/tripInstanceRoutes.js";
import authRouter from "./routes/authRoutes.js";
// Removed clerkMiddleware
app.use("/api/auth", authRouter);
app.use("/api/destinations", destinationRouter);
app.use("/api/trip-instances", tripInstanceRouter);
```

**🔧 server/models/User.js**
```javascript
BEFORE:
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
});

AFTER:
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["client", "admin"], default: "client" },
  image: { type: String, default: "/src/assets/profile.png" }
}, {
  timestamps: true
});
```

**🔧 server/models/Booking.js**
```javascript
BEFORE:
const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true, ref: "User" },
  show: { type: String, required: true, ref: "Show" },
  amount: { type: Number, required: true },
  bookedSeats: { type: Array, required: true },
  isPaid: { type: Boolean, default: false },
  paymentLink: { type: String },
});

AFTER:
const bookingSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  tripInstanceID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "TripInstance" },
  seats: [{ type: String, required: true }],
  status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  amount: { type: Number, required: true },
  paymentLink: { type: String },
});
```

**🔧 server/controllers/userController.js**
```javascript
BEFORE:
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
  const user = req.auth().userId;
  const bookings = await Booking.find({ user })
    .populate({ path: "show", populate: { path: "movie" } });
};

export const updateFavorite = async (req, res) => {
  const userId = req.auth().userId;
  const user = await clerkClient.users.getUser(userId);
  // Clerk metadata manipulation
};

AFTER:
import User from "../models/User.js";

export const getUserBookings = async (req, res) => {
  const userId = req.user._id;
  const bookings = await Booking.find({ userID: userId })
    .populate({ path: "tripInstanceID", populate: { path: "tripTemplateID" } });
};

// REMOVED: updateFavorite and getFavorites functions
```

**🔧 server/controllers/bookingController.js**
```javascript
BEFORE:
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  const { userId } = req.auth();
  const { showId, selectedSeats } = req.body;
  const showData = await Show.findById(showId).populate("movie");
  // Show-based booking logic
};

export const getOccupiedSeats = async (req, res) => {
  const { showId } = req.params;
  const showData = await Show.findById(showId);
  const occupiedSeats = Object.keys(showData.occupiedSeats);
};

AFTER:
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";

export const createBooking = async (req, res) => {
  const userId = req.user._id;
  const { tripInstanceId, selectedSeats } = req.body;
  const tripInstance = await TripInstance.findById(tripInstanceId);
  // Trip-based booking logic
};

export const getOccupiedSeats = async (req, res) => {
  const { tripInstanceId } = req.params;
  const tripInstance = await TripInstance.findById(tripInstanceId);
  res.json({ success: true, occupiedSeats: tripInstance.bookedSeats });
};
```

**🔧 server/controllers/adminController.js**
```javascript
BEFORE:
import Show from "../models/Show.js";

export const getDashboardData = async (req, res) => {
  const bookings = await Booking.find({ isPaid: true });
  const activeShows = await Show.find({ showDateTime: { $gte: new Date() } });
  const totalUser = await User.countDocuments();
};

export const getAllShows = async (req, res) => {
  const shows = await Show.find({ showDateTime: { $gte: new Date() } })
    .populate("movie");
};

AFTER:
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";

export const getDashboardData = async (req, res) => {
  const bookings = await Booking.find({ status: "paid" });
  const activeTrips = await TripInstance.find({ date: { $gte: new Date().toISOString().split('T')[0] } });
  const totalUsers = await User.countDocuments();
  const totalDestinations = await Destination.countDocuments();
};

export const getAllTripInstances = async (req, res) => {
  const tripInstances = await TripInstance.find({}).sort({ date: 1, time: 1 });
};
```

**🔧 server/middleware/auth.js**
```javascript
BEFORE:
import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  const { userId } = req.auth();
  const user = await clerkClient.users.getUser(userId);
  if (user.privateMetadata.role !== "admin") {
    return res.json({ success: false, message: "not authorized" });
  }
  next();
};

AFTER:
// This file is deprecated - use jwtAuth.js instead
export { protectAdmin, authenticateToken } from "./jwtAuth.js";
```

**🔧 server/routes/userRoutes.js**
```javascript
BEFORE:
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";

userRouter.get("/bookings", getUserBookings);
userRouter.post("/update-favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);

AFTER:
import { getUserBookings } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/jwtAuth.js";

userRouter.use(authenticateToken);
userRouter.get("/bookings", getUserBookings);
// REMOVED: favorites routes
```

**🔧 server/routes/adminRoutes.js**
```javascript
BEFORE:
import { protectAdmin } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controllers/adminController.js";

adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-shows", protectAdmin, getAllShows);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

AFTER:
import { authenticateToken, protectAdmin } from "../middleware/jwtAuth.js";
import { getAllBookings, getAllTripInstances, getDashboardData, isAdmin } from "../controllers/adminController.js";

adminRouter.use(authenticateToken);
adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-trip-instances", protectAdmin, getAllTripInstances);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);
```

**🔧 server/routes/bookingRoutes.js**
```javascript
BEFORE:
bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

AFTER:
import { authenticateToken } from "../middleware/jwtAuth.js";

bookingRouter.post("/create", authenticateToken, createBooking);
bookingRouter.get("/seats/:tripInstanceId", getOccupiedSeats);
```

**🔧 server/inngest/index.js**
```javascript
BEFORE:
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => { /* Clerk user sync */ }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications,
];

AFTER:
// Note: Clerk user sync functions removed as we're using custom authentication

export const functions = [
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications,
];
```

## 🔄 **FUNCTIONALITY CHANGES**

### **Authentication System**
- **BEFORE**: Clerk handles everything automatically
- **AFTER**: Custom JWT-based authentication with manual implementation

### **User Management**
- **BEFORE**: Users stored in Clerk cloud + local sync
- **AFTER**: Users stored entirely in local database

### **Route Protection**
- **BEFORE**: `clerkMiddleware()` protects all routes automatically
- **AFTER**: Custom `authenticateToken` middleware per route

### **User Interface**
- **BEFORE**: Clerk's pre-built `UserButton` component
- **AFTER**: Custom dropdown menu with same functionality

### **Data Models**
- **BEFORE**: Movie/Show booking system
- **AFTER**: Destination/TripInstance minibus system

### **API Endpoints**
- **BEFORE**: `/api/show/*` endpoints
- **AFTER**: `/api/destinations/*` and `/api/trip-instances/*` endpoints

## 📊 **SUMMARY OF CHANGES**

| Category | Files Removed | Files Added | Files Modified |
|----------|---------------|-------------|----------------|
| **Models** | 2 | 2 | 2 |
| **Controllers** | 0 | 3 | 4 |
| **Routes** | 1 | 3 | 3 |
| **Middleware** | 0 | 1 | 1 |
| **Client Pages** | 0 | 2 | 2 |
| **Client Components** | 0 | 0 | 2 |
| **Client Context** | 0 | 0 | 1 |
| **Config** | 0 | 0 | 1 |
| **TOTAL** | **3** | **11** | **16** |

## 🎯 **KEY TRANSFORMATIONS**

1. **Authentication**: Clerk → Custom JWT
2. **Database**: `quickshow` → `minibus`
3. **Models**: Movie/Show → Destination/TripInstance
4. **User Schema**: Clerk ID → Full user profile
5. **UI Components**: Clerk components → Custom components
6. **API Structure**: Show-based → Trip-based
7. **State Management**: Clerk hooks → Custom React state
8. **Route Protection**: Global middleware → Per-route middleware
