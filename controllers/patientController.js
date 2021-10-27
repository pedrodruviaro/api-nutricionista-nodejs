const router = require("express").Router();
const verifyToken = require("../common/verifyToken");
const PatientValidation = require("../common/validations/PatientValidation");
const Patient = require("../models/Patient");

/*
    --- REGISTER NEW Patient ---
        /api/Patient/new
*/
router.post("/new", verifyToken, async (req, res) => {
    // checking errors
    const { error } = PatientValidation.newPatient(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
        // getting nutri id
        const nutriId = req.user.id;

        // calculating BMI
        const bmi = req.body.weight / (req.body.heigth * req.body.heigth);

        // inserting patient
        const newPatient = new Patient({ ...req.body, bmi, nutriId });

        const savedPatient = await newPatient.save();

        return res.status(200).json(savedPatient._doc);
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- GETTING A SINGLE Patient ---
        /api/Patient/:id
*/
router.get("/:id", verifyToken, async (req, res) => {
    const nutriId = req.user.id;
    const PatientId = req.params.id;

    try {
        const Patient = await Patient.findOne({ _id: PatientId });
        if (Patient && Patient.nutriId !== nutriId) {
            return res
                .status(401)
                .json({ error: "You can only get your patients" });
        }
        if (!Patient)
            return res.status(404).json({ error: "Patient not found" });

        return res.status(200).json(Patient);
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- GETTING ALL PatientS FOR A NUTRI ---
        /api/Patient/all/:nutriId
*/
router.get("/all/:nutriId", verifyToken, async (req, res) => {
    const nutriAuthId = req.user.id;
    const nutriParamsId = req.params.nutriId;

    if (nutriAuthId != nutriParamsId)
        return res.status(401).json({ errro: "Unauthorized" });

    try {
        const patients = await Patient.find({ nutriId: nutriAuthId });
        return res.status(200).json(patients);
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- DELETE A PATIENT ---
        /api/Patient/delete/:id
*/
router.delete("/delete/:id", verifyToken, async (req, res) => {
    const patientId = req.params.id;
    const nutriId = req.user.id;

    try {
        await Patient.findOneAndRemove({
            $and: [{ _id: patientId }, { nutriId: nutriId }],
        });

        return res.status(200).json("Patient removed");
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;
