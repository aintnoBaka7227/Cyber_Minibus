export const destinations = [
  {
    _id: "650000000000000000010001",
    name: "Hahndorf",
    teaser: "Picturesque town with German heritage",
    description: "Escape to Hahndorf, a charming historic town in Adelaide Hills...",
    rating: 4.5,
    mainphoto: "https://hahndorfsa.org.au/wp-content/uploads/2025/01/hahndorf-german-town-02-1024x681.png",
    tripTemplates: [
      {
        _id: "650000000000000000020001",
        startPoints: [
          { id: "650000000000000000030001", name: "Adelaide CBD" },
          { id: "650000000000000000030002", name: "Glenelg" }
        ],
        departureTimes: ["09:00", "10:00", "11:00"],
        price: 25,
        seatLayout: ["A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3","C4","D1","D2","D3","D4","E1","E2","E3","E4","F1","F2","F3","F4","G1","G2","G3","G4","H1","H2","H3","H4"]
      }
    ]
  },
  {
    _id: "650000000000000000010002",
    name: "Port Elliot",
    teaser: "Coastal town with stunning beaches",
    description: "Visit Port Elliot for its scenic beaches and historic jetty...",
    rating: 4.2,
    mainphoto: "/portelliot.jpeg",
    tripTemplates: [
      {
        _id: "650000000000000000020002",
        startPoints: [
          { id: "650000000000000000030001", name: "Adelaide CBD" }
        ],
        departureTimes: ["08:30", "12:30", "16:30"],
        price: 35,
        seatLayout: ["A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3","C4","D1","D2","D3","D4","E1","E2","E3","E4","F1","F2","F3","F4","G1","G2","G3","G4","H1","H2","H3","H4"]
      }
    ]
  }
];



export const tripInstances = [
  {
    _id: "650000000000000000040001",
    tripTemplateID: "650000000000000000020001", // Hahndorf trip template
    date: "2025-09-15",
    time: "09:00",
    bookedSeats: ["A1","A2"] // booked by alice
  },
  {
    _id: "650000000000000000040002",
    tripTemplateID: "650000000000000000020001", // Hahndorf
    date: "2025-09-16",
    time: "10:00",
    bookedSeats: ["B1"] // booked by bob
  },
  {
    _id: "650000000000000000040003",
    tripTemplateID: "650000000000000000020002", // Port Elliot
    date: "2025-09-15",
    time: "12:30",
    bookedSeats: ["A1"] // booked by alice
  }
];



export const bookings = [
  {
    _id: "650000000000000000050001",
    userID: "650000000000000000000001", // alice
    tripInstanceID: "650000000000000000040001", // Hahndorf 09:00
    seats: ["A1","A2"],
    status: "paid",
    createdAt: new Date("2025-08-27T12:00:00Z")
  },
  {
    _id: "650000000000000000050002",
    userID: "650000000000000000000002", // bob
    tripInstanceID: "650000000000000000040002", // Hahndorf 10:00
    seats: ["B1"],
    status: "paid",
    createdAt: new Date("2025-08-28T10:00:00Z")
  },
  {
    _id: "650000000000000000050003",
    userID: "650000000000000000000001", // alice
    tripInstanceID: "650000000000000000040003", // Port Elliot 12:30
    seats: ["A1"],
    status: "paid",
    createdAt: new Date("2025-08-28T09:30:00Z")
  },
  {
    _id: "650000000000000000050004",
    userID: "650000000000000000000002", // alice
    tripInstanceID: "650000000000000000040003", // Port Elliot 12:30
    seats: ["D1"],
    status: "cancelled",
    createdAt: new Date("2025-08-28T09:30:00Z")
  }
];



export const users = [
  {
    _id: "650000000000000000000001",
    username: "alice",
    password: "password123",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    phone: "0412345678",
    address: "123 Main St, Adelaide",
    role: "client",
    createdAt: new Date("2025-08-01T08:00:00Z")
  },
  {
    _id: "650000000000000000000002",
    username: "bob",
    password: "password456",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    phone: "0498765432",
    address: "456 King St, Adelaide",
    role: "client",
    createdAt: new Date("2025-08-05T09:00:00Z")
  },
  {
    _id: "650000000000000000000003",
    username: "admin",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: "0411000000",
    address: "Admin HQ",
    role: "admin",
    createdAt: new Date("2025-08-01T08:00:00Z")
  }
];
