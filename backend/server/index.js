const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

/* =============================
   User Schema
============================= */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "faculty", "student"],
    default: "student"
  }
});

const User = mongoose.model("User", userSchema);

/* =============================
   REGISTER
============================= */
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered ❌" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    role
  });

  await user.save();
  res.json({ message: "User Registered Successfully ✅" });
});

/* =============================
   LOGIN
============================= */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User Not Found ❌" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Password ❌" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* =============================
   AUTH MIDDLEWARE
============================= */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No Token ❌" });

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    return res.status(400).json({ message: "Invalid Token ❌" });
  }
}

/* =============================
   ROLE MIDDLEWARE
============================= */
function roleMiddleware(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access Denied ❌" });
    }
    next();
  };
}

/* =============================
   ROLE ROUTES
============================= */
app.get("/api/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

app.get("/api/faculty", authMiddleware, roleMiddleware("faculty"), (req, res) => {
  res.json({ message: "Welcome Faculty 📚" });
});

app.get("/api/student", authMiddleware, roleMiddleware("student"), (req, res) => {
  res.json({ message: "Welcome Student 🎓" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});