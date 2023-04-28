const mongoose = require("mongoose");

module.exports = mongoose.model("cookie",
    mongoose.Schema({
        cookieID: Number,
        ingredients: String,
        name: String,
        imagePath: String,
        price: Number,
        currentyPopular: Boolean
    })
); 
