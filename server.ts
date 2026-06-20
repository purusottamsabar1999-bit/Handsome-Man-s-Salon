/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data-store.json");

// Helper to load / save db contents
interface DBStructure {
  appointments: any[];
  services: any[];
  barbers: any[];
  reviews: any[];
}

const DEFAULT_SERVICES = [
  {
    id: "s1",
    name: "Classic Hair Cutting",
    price: 120,
    duration: 20,
    description: "Tailored scissor cuts, classic tapers, or modern skin fades with razor finish neck trim."
  },
  {
    id: "s2",
    name: "Premium Hair Styling",
    price: 80,
    duration: 15,
    description: "Professional hair shaping and set using premium matte pomades, clays, or high-end styling gel."
  },
  {
    id: "s3",
    name: "Revitalizing Hair Spa",
    price: 350,
    duration: 40,
    description: "Deep hair conditioning, therapeutic scalp massage, and steam session to restore strength and custom luster."
  },
  {
    id: "s4",
    name: "Hair Wash & Blow Dry",
    price: 100,
    duration: 15,
    description: "Refreshing hair wash with premium biological shampoos followed by styled blow-drying."
  },
  {
    id: "s5",
    name: "Hygienic Waxing",
    price: 150,
    duration: 20,
    description: "Clean and hygienic wax-based removal of unwanted nose, ear, or forehead hair."
  },
  {
    id: "s6",
    name: "Skin Care & Facial",
    price: 450,
    duration: 35,
    description: "Deep skin exfoliation, relaxing face massage with hydra cream, and pore-cleansing pack."
  },
  {
    id: "s7",
    name: "Precision Beard Trim",
    price: 80,
    duration: 15,
    description: "Detailed beard shaping, contouring, and alignment with soothing beard oils."
  },
  {
    id: "s8",
    name: "Classic Hot Towel Shave",
    price: 70,
    duration: 20,
    description: "Straight razor shave featuring hot steamed towels, rich protective lather, and cooling astringents."
  },
  {
    id: "s9",
    name: "Professional Hair Coloring",
    price: 300,
    duration: 45,
    description: "Flawless grey coverage or custom highlights with premium ammonia-free hair colors."
  }
];

const DEFAULT_BARBERS = [
  {
    id: "b1",
    name: "Ramesh Kumar",
    specialty: "Master Hair Styling & Detailed Fades",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "b2",
    name: "Amit Sahu",
    specialty: "Beard Sculpting & Classic Shear Trims",
    photo: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "b3",
    name: "Sunil Patra",
    specialty: "Therapeutic Hair Spa & Skin Care Facials",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400"
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "r1",
    name: "Debasish Panda",
    rating: 5,
    comment: "Excellent service! Best men's salon near Apollo Pharmacy in Rayagada. Highly professional staff and very hygienic.",
    createdAt: new Date().toISOString()
  },
  {
    id: "r2",
    name: "Soumya Ranjan",
    rating: 5,
    comment: "The Hair Spa and Skin Care treatments are top-class. Extremely budget-friendly pricing and flawless attention to details.",
    createdAt: new Date().toISOString()
  },
  {
    id: "r3",
    name: "Prakash Pradhan",
    rating: 5,
    comment: "Very easy to book online. Ramesh gave me an amazing modern fade. Will definitely visit again!",
    createdAt: new Date().toISOString()
  }
];

function initDB(): DBStructure {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        appointments: parsed.appointments || [],
        services: parsed.services || DEFAULT_SERVICES,
        barbers: parsed.barbers || DEFAULT_BARBERS,
        reviews: parsed.reviews || DEFAULT_REVIEWS,
      };
    } catch (e) {
      console.error("Error reading database file, writing fresh defaults", e);
    }
  }
  const defaultDB: DBStructure = {
    appointments: [],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
    reviews: DEFAULT_REVIEWS,
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), "utf-8");
  return defaultDB;
}

const db = initDB();

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

app.use(express.json());

// CORS & CSRF/Security Middlewares Mock helper
app.use((req, res, next) => {
  // Safe validation header decoration
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// rate limiting logic
const ipRateStore = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowTime = 60 * 1000; // 1 minute
  const limit = 15; // 15 calls per minute for booking submissions

  const userRecord = ipRateStore.get(ip);
  if (!userRecord || now > userRecord.resetTime) {
    ipRateStore.set(ip, { count: 1, resetTime: now + windowTime });
    next();
  } else {
    if (userRecord.count >= limit) {
      res.status(429).json({ error: "Too many submission attempts. Please wait 1 minute." });
    } else {
      userRecord.count++;
      next();
    }
  }
}

// PUBLIC API ENDPOINTS
app.get("/api/public-data", (req, res) => {
  res.json({
    services: db.services,
    barbers: db.barbers,
    reviews: db.reviews,
  });
});

// BOOKING SUBMISSION (Guest Booking)
app.post("/api/appointments", rateLimiter, (req, res) => {
  const { name, phone, email, serviceId, date, time, notes } = req.body;

  if (!name || !phone || !serviceId || !date || !time) {
    res.status(400).json({ error: "Missing required fields for booking. Name, phone, service, date, and preferred time are required." });
    return;
  }

  // Cross-reference serviceId
  const service = db.services.find(s => s.id === serviceId);
  if (!service) {
    res.status(400).json({ error: "Invalid service selection." });
    return;
  }

  const newAppointment = {
    id: "apt_" + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    phone: phone.trim(),
    email: (email || "").trim(),
    serviceId,
    date,
    time,
    notes: (notes || "").trim(),
    status: "Pending", // Default initial status
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment); // top priority sorting
  saveDB();

  // Return success message
  res.status(201).json({
    success: true,
    message: `Appointment successfully registered! We have scheduled your slot with service "${service.name}".`,
    appointment: newAppointment
  });
});

// SUBMIT TESTIMONIAL
app.post("/api/reviews", (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    res.status(400).json({ error: "Name, rating, and comment are required." });
    return;
  }

  const parsedRating = parseInt(rating, 10);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    res.status(400).json({ error: "Rating must be a structural integer between 1 and 5." });
    return;
  }

  const newReview = {
    id: "rev_" + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    rating: parsedRating,
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  saveDB();

  res.status(201).json({ success: true, review: newReview });
});

// ADMIN CONFIG & SESSION MOCK (simple, sturdy, secure password matching)
// Password: md5/hardcoded match as requested in simplified stack
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = "$2b$10$HANDSOMESalonAdminPasswordHashedPlaceholder"; // hardcoded matching password: "handsome123"

// Simple token system for session auth
const activeAdminTokens = new Set<string>();

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === "handsome123") {
    const token = "token_" + Math.random().toString(36).substr(2, 16);
    activeAdminTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid admin username or password!" });
  }
});

// ADMIN AUTHENTICATION MIDDLEWARE
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized admin access." });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (activeAdminTokens.has(token)) {
    next();
  } else {
    res.status(401).json({ error: "Invalid or expired admin session token." });
  }
}

// GET ADMIN APPOINTMENTS
app.get("/api/admin/appointments", authenticateAdmin, (req, res) => {
  res.json({ appointments: db.appointments });
});

// UPDATE APPOINTMENT STATUS (Confirmed, Completed, Cancelled)
app.post("/api/admin/appointments/:id/status", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
    res.status(400).json({ error: "Invalid status state configuration." });
    return;
  }

  const appointment = db.appointments.find(a => a.id === id);
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found." });
    return;
  }

  appointment.status = status;
  saveDB();
  res.json({ success: true, appointment });
});

// DELETE APPOINTMENT
app.delete("/api/admin/appointments/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const idx = db.appointments.findIndex(a => a.id === id);
  if (idx !== -1) {
    db.appointments.splice(idx, 1);
    saveDB();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Appointment not found." });
  }
});

// ADMIN: CREATE/EDIT SERVICES (CRUD)
app.post("/api/admin/services", authenticateAdmin, (req, res) => {
  const { id, name, price, duration, description } = req.body;
  if (!name || isNaN(parseFloat(price)) || isNaN(parseInt(duration))) {
    res.status(400).json({ error: "Name, price, and duration have invalid specifications." });
    return;
  }

  if (id) {
    // Edit mode
    const service = db.services.find(s => s.id === id);
    if (!service) {
      res.status(404).json({ error: "Service configuration not found." });
      return;
    }
    service.name = name.trim();
    service.price = parseFloat(price);
    service.duration = parseInt(duration, 10);
    service.description = description ? description.trim() : "";
    saveDB();
    res.json({ success: true, service });
  } else {
    // Create Mode
    const newService = {
      id: "s_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      price: parseFloat(price),
      duration: parseInt(duration, 10),
      description: description ? description.trim() : ""
    };
    db.services.push(newService);
    saveDB();
    res.status(201).json({ success: true, service: newService });
  }
});

// ADMIN: DELETE SERVICE
app.delete("/api/admin/services/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const idx = db.services.findIndex(s => s.id === id);
  if (idx !== -1) {
    db.services.splice(idx, 1);
    saveDB();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Service not found." });
  }
});

// ADMIN: CREATE/EDIT BARBERS (CRUD)
app.post("/api/admin/barbers", authenticateAdmin, (req, res) => {
  const { id, name, specialty, photo } = req.body;
  if (!name || !specialty) {
    res.status(400).json({ error: "Name and specialty are required." });
    return;
  }

  const defaultPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400";
  const finalPhoto = (photo || "").trim() || defaultPhoto;

  if (id) {
    // Edit mode
    const barber = db.barbers.find(b => b.id === id);
    if (!barber) {
      res.status(404).json({ error: "Barber profile not found." });
      return;
    }
    barber.name = name.trim();
    barber.specialty = specialty.trim();
    barber.photo = finalPhoto;
    saveDB();
    res.json({ success: true, barber });
  } else {
    // Create mode
    const newBarber = {
      id: "b_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      specialty: specialty.trim(),
      photo: finalPhoto
    };
    db.barbers.push(newBarber);
    saveDB();
    res.status(201).json({ success: true, barber: newBarber });
  }
});

// ADMIN: DELETE BARBER
app.delete("/api/admin/barbers/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const idx = db.barbers.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.barbers.splice(idx, 1);
    saveDB();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Barber not found." });
  }
});

async function startServer() {
  // Vite middleware dynamic integration for asset dev-serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Handsome Men's Salon] Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
