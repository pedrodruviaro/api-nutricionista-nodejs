const router = require("express").Router();
const verifyToken = require("../common/verifyToken");
const PacientValidation = require("../common/validations/pacientValidation");
const Pacient = require("../models/Pacient");

/*
    --- REGISTER NEW PACIENT ---
        /api/pacient/new
*/
router.post("/new", verifyToken, async (req, res) => {
    // checking errors
    const { error } = PacientValidation.newPacient(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
        // getting nutri id
        const nutriId = req.user.id;

        // calculating BMI
        const bmi = req.body.weight / (req.body.heigth * req.body.heigth);

        // inserting patient
        const newPacient = new Pacient({ ...req.body, bmi, nutriId });

        const savedPacient = await newPacient.save();

        return res.status(200).json(savedPacient._doc);
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- GETTING A SINGLE PACIENT ---
        /api/pacient/:id
*/
router.get("/:id", verifyToken, async (req, res) => {
    const nutriId = req.user.id;
    const pacientId = req.params.id;

    try {
        const pacient = await Pacient.findOne({ _id: pacientId });
        if (pacient && pacient.nutriId !== nutriId) {
            return res
                .status(401)
                .json({ error: "You can only get your patients" });
        }
        if (!pacient)
            return res.status(404).json({ error: "Pacient not found" });

        return res.status(200).json(pacient);
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- GETTING ALL PACIENTS FOR A NUTRI ---
        /api/pacient/all/:nutriId
*/
router.get("/all/:nutriId", verifyToken, async (req, res) => {
    const nutriAuthId = req.user.id;
    const nutriParamsId = req.params.nutriId;

    if (nutriAuthId != nutriParamsId)
        return res.status(401).json({ errro: "Unauthorized" });

    try {
        const patients = await Pacient.find({ nutriId: nutriAuthId });
        return res.status(200).json(patients);
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;
