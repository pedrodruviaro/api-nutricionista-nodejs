const mongoose = require("mongoose");

const NutriSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 6,
            max: 100,
        },
        email: {
            type: String,
            required: true,
            min: 6,
            max: 150,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 1000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("nutris", NutriSchema);
