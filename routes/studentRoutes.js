const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ➕ Add Student
router.post("/", async (req, res) => {
  try {
    const { name, email, course, marks } = req.body;

    // validation
    if (!name || !email || !course || marks === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = new Student({ name, email, course, marks });
    await student.save();

    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error("POST ERROR:", err.message);

    // duplicate email handler
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: err.message });
  }
});

// 📄 Get All + Search
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const students = await Student.find({
      name: { $regex: search, $options: "i" }
    });

    res.json(students);
  } catch (err) {
    console.error("GET ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Student
router.put("/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("PUT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;