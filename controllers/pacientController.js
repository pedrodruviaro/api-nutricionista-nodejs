const router = require("express").Router();
const verifyToken = require("../common/verifyToken");
const PacientValidation = require("../common/validations/pacientValidation");
const Pacient = require("../models/Pacient");

router.post("/new", verifyToken, async (req, res) => {
    // checking errors
    const { error } = PacientValidation.newPacient(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    // getting nutri id
    const nutriId = req.user.id;

    // calculating BMI
    const bmi = req.body.weight / (req.body.heigth * req.body.heigth);

    // inserting patient
    const newPacient = new Pacient({ ...req.body, bmi, nutriId });

    const savedPacient = await newPacient.save();

    return res.status(200).json(savedPacient._doc);
});

module.exports = router;
