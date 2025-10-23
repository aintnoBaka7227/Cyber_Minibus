import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";
import User from "../models/User.js";
import vulnerable from "../configs/vulnerable.js";

// GET /dashboard-stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get total users count (clients only)
    const totalUsers = await User.countDocuments({ role: "client" });
    
    // Get active routes (destinations count)
    const activeRoutes = await Destination.countDocuments();
    
    // Calculate total revenue from paid bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: "paid" } },
      {
        $lookup: {
          from: TripInstance.collection.name,
          localField: "tripInstanceID",
          foreignField: "_id",
          as: "tripInstance",
        },
      },
      { $unwind: "$tripInstance" },
      {
        $lookup: {
          from: Destination.collection.name,
          let: { tripTemplateID: "$tripInstance.tripTemplateID" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$tripTemplateID", "$tripTemplates._id"],
                },
              },
            },
            {
              $project: {
                tripTemplate: {
                  $first: {
                    $filter: {
                      input: "$tripTemplates",
                      as: "template",
                      cond: { $eq: ["$$tripTemplateID", "$$template._id"] },
                    },
                  },
                },
              },
            },
          ],
          as: "destination",
        },
      },
      {
        $addFields: {
          destination: { $first: "$destination" },
        },
      },
      {
        $addFields: {
          pricePerSeat: "$destination.tripTemplate.price",
          seatCount: { $size: "$seats" },
        },
      },
      {
        $addFields: {
          bookingRevenue: {
            $multiply: [
              { $ifNull: ["$pricePerSeat", 0] },
              { $ifNull: ["$seatCount", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$bookingRevenue" },
        },
      },
    ]);
    
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;
    
    return res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        activeRoutes,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeRegex = (input) => {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildUserQuery = (search, role) => {
  const query = {};
  if (role) query.role = role;
  if (search) {
    // CTF mode: intentionally vulnerable regex search (ReDoS risk)
    // Safe mode escapes input; vulnerable mode passes raw pattern.
    // Examples (slow patterns in vuln mode): ^(a+)+$, (a|aa)+$, (.*a){20}$
    // In vulnerable mode, allow raw patterns (ReDoS‑prone).
    // In safe mode, escape user input to a literal substring match.
    const regex = vulnerable.isSqlIVulnerable()
      ? new RegExp(search, "i")
      : new RegExp(escapeRegex(search).slice(0, 64), "i");
    query.$or = [
      { username: regex },
      { email: regex },
      { firstName: regex },
      { lastName: regex },
    ];
  }
  return query;
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, sort = "createdAt:desc" } = req.query;
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 20);
    const skip = (page - 1) * limit;

    const [sortField, sortOrderRaw] = sort.split(":");
    const sortOrder = sortOrderRaw === "asc" ? 1 : -1;
    const sortOptions = {};
    if (sortField) sortOptions[sortField] = sortOrder;

    const query = buildUserQuery(search, role);

    // CTF mode: intentionally vulnerable projection control
    // (toggle via VULNERABLE_SQLI_MODE=true)
    // Allow client to control the projection passed to .select().
    // Examples:
    //  - ?fields=username email password
    //  - ?fields={"username":1,"email":1,"password":1}
    // In safe mode we exclude sensitive fields (password, __v).
    let projection = "-password -__v";
    if (vulnerable.isSqlIVulnerable()) {
      const raw = req.query.fields;
      if (typeof raw === "string" && raw.trim()) {
        const t = raw.trim();
        if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
          try {
            projection = JSON.parse(t);
          } catch {
            projection = raw;
          }
        } else {
          projection = raw;
        }
      }
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select(projection)
        .sort(Object.keys(sortOptions).length ? sortOptions : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const buildDateFilter = (from, to) => {
  if (!from && !to) return {};
  const createdAt = {};
  if (from) createdAt.$gte = new Date(from);
  if (to) createdAt.$lte = new Date(to);
  return { createdAt };
};

const revenueGroupStage = (groupBy) => {
  switch (groupBy) {
    case "day":
      return {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        totalRevenue: { $sum: "$bookingRevenue" },
        bookings: { $sum: 1 },
      };
    case "destination":
      return {
        _id: "$destinationName",
        totalRevenue: { $sum: "$bookingRevenue" },
        bookings: { $sum: 1 },
      };
    default:
      return {
        _id: null,
        totalRevenue: { $sum: "$bookingRevenue" },
        bookings: { $sum: 1 },
      };
  }
};

export const getRevenue = async (req, res) => {
  try {
    const { from, to, groupBy } = req.query;

    // CTF mode: intentionally vulnerable aggregation injection
    // (toggle via VULNERABLE_SQLI_MODE=true)
    // Allow client-supplied JSON to be merged into the $match stage and
    // optionally append raw pipeline stages (tail) to the aggregation.
    // Examples:
    //  - ?match={"status":{"$ne":"paid"}}
    //  - ?tail=[{"$project":{"debugUser":"$user","_id":0}}]
    let unsafeMatch = {};
    let unsafeTail = [];
    if (vulnerable.isSqlIVulnerable()) {
      try {
        if (typeof req.query.match === "string") {
          unsafeMatch = JSON.parse(req.query.match);
        }
      } catch {}
      try {
        if (typeof req.query.tail === "string") {
          const parsed = JSON.parse(req.query.tail);
          if (Array.isArray(parsed)) unsafeTail = parsed;
        }
      } catch {}
    }

    const matchStage = {
      status: "paid",
      ...buildDateFilter(from, to),
      ...(vulnerable.isSqlIVulnerable() ? unsafeMatch : {}), // VULNERABLE: merge untrusted match
    };

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: TripInstance.collection.name,
          localField: "tripInstanceID",
          foreignField: "_id",
          as: "tripInstance",
        },
      },
      { $unwind: "$tripInstance" },
      {
        $lookup: {
          from: Destination.collection.name,
          let: { tripTemplateID: "$tripInstance.tripTemplateID" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$tripTemplateID", "$tripTemplates._id"],
                },
              },
            },
            {
              $project: {
                name: 1,
                tripTemplate: {
                  $first: {
                    $filter: {
                      input: "$tripTemplates",
                      as: "template",
                      cond: { $eq: ["$$tripTemplateID", "$$template._id"] },
                    },
                  },
                },
              },
            },
          ],
          as: "destination",
        },
      },
      {
        $addFields: {
          destination: { $first: "$destination" },
        },
      },
      {
        $addFields: {
          destinationName: "$destination.name",
          pricePerSeat: "$destination.tripTemplate.price",
          seatCount: { $size: "$seats" },
        },
      },
      {
        $addFields: {
          bookingRevenue: {
            $multiply: [
              { $ifNull: ["$pricePerSeat", 0] },
              { $ifNull: ["$seatCount", 0] },
            ],
          },
        },
      },
      {
        $group: revenueGroupStage(groupBy),
      },
      { $sort: { totalRevenue: -1 } },
    ];

    // VULNERABLE: append arbitrary stages supplied by client when toggle enabled
    if (vulnerable.isSqlIVulnerable() && unsafeTail.length) {
      pipeline.push(...unsafeTail);
    }

    const aggregation = await Booking.aggregate(pipeline);

    if (!aggregation.length) {
      return res.json({
        success: true,
        data: {
          totalRevenue: 0,
          bookings: 0,
          breakdown: [],
        },
      });
    }

    if (groupBy === "day" || groupBy === "destination") {
      return res.json({
        success: true,
        data: {
          breakdown: aggregation,
          totalRevenue: aggregation.reduce((sum, item) => sum + item.totalRevenue, 0),
          bookings: aggregation.reduce((sum, item) => sum + item.bookings, 0),
        },
      });
    }

    return res.json({
      success: true,
      data: {
        totalRevenue: aggregation[0].totalRevenue,
        bookings: aggregation[0].bookings,
      },
    });
  } catch (error) {
    console.error("getRevenue error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate revenue",
    });
  }
};
