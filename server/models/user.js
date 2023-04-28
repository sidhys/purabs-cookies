const mongoose = require("mongoose");

module.exports = mongoose.model("user",
    mongoose.Schema({
        userID: Number
    })
);