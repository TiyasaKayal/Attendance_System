const mongoose = require('mongoose');

const {Schema } = mongoose;

const studentSchema = new Schema({
    name: String,
    dateofreg: String,
    Rollno: String,
    attendance: [String]
})

const student = mongoose.model('student', studentSchema);
module.exports = student;