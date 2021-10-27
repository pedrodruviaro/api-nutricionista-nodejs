const mongoose = require("mongoose");

const PacientSchema = new mongoose.Schema(
    {
        nutriId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            min: 6,
            max: 100,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 150,
        },
        weight: {
            type: Number,
            required: true,
            max: 500,
        },
        heigth: {
            type: Number,
            required: true,
            max: 500,
        },
        bmi: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: false,
            default: "",
        },
        notes: {
            type: Array,
            default: [],
        },
        restrictions: {
            type: [String],
            default: [],
        },
        diet: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("pacients", PacientSchema);
