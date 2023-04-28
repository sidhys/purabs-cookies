const mongoose = require("mongoose");

module.exports = mongoose.model("cart",
    mongoose.Schema({
        userID: Number,
        cookies: [
            {
                cookieID: Number,
                quantity: Number,
            }
        ]
    })
);