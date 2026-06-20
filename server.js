const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Database connection error: ", err));

const StudentSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    attendanceStatus: { type: String, default: "Absent" } 
});

const Student = mongoose.model('Student', StudentSchema);

app.post('/api/students', async (req, res) => {
    try {
        const { name, rollNo } = req.body;
        const newStudent = new Student({ name, rollNo });
        await newStudent.save();
        res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/students/:rollNo', async (req, res) => {
    try {
        const { rollNo } = req.params;
        const { status } = req.body; 

        const updatedStudent = await Student.findOneAndUpdate(
            { rollNo: rollNo },
            { attendanceStatus: status },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Attendance updated", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});