const mongoose = require("mongoose");

const Pet = mongoose.model("Pet", mongoose.Schema({
    Name: String,
    Type: String,
    Breed: String,
    Age: Number
}))

module.exports = {Pet}