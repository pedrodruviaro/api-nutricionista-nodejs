const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Nutri = require("../models/Nutri");
const AuthValidation = require("../common/validations/authValidation");
const verifyToken = require("../common/verifyToken");

/*
    --- REGISTER NEW NUTRI ---
        /api/auth/register
*/
router.post("/register", async (req, res) => {
    // checking input
    const { error } = AuthValidation.register(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // checking if user exists
    try {
        const emailExists = await Nutri.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ error: "Email already registered" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }

    try {
        // bcrypt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //inserting into db
        const newNutri = new Nutri({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
        });

        const savedNutri = await newNutri.save();
        const { password, ...rest } = savedNutri._doc;
        return res.status(200).json({ ...rest });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- LOGIN NUTRI ---
        /api/auth/login
*/
router.post("/login", async (req, res) => {
    // checking error
    const { error } = AuthValidation.login(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        // checking if nutri exists
        const nutri = await Nutri.findOne({ email: req.body.email });
        if (!nutri) return res.status(404).json({ error: "Wrong credentials" });

        // checking password
        const passwordIsValid = await bcrypt.compare(
            req.body.password,
            nutri.password
        );
        if (!passwordIsValid)
            return res.status(404).json({ error: "Wrong credentials" });

        const token = jwt.sign({ id: nutri._id }, process.env.TOKEN_SECRET);

        const { password, ...rest } = nutri._doc;
        return res.status(200).json({ ...rest, token });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/*
    --- EDITING NUTRI ---
        /api/auth/edit/:id
*/
router.put("/edit/:id", verifyToken, async (req, res) => {
    const paramsNutriId = req.params.id;
    const authNutriId = req.user.id;

    // checking if are the same
    if (paramsNutriId != authNutriId) {
        return res.status(401).json({ error: "unauthorized" });
    }

    if (req.body.password) {
        return res.status(400).json({ error: "Cannot update password here" });
    }

    try {
        const update = req.body;
        const updatedNutri = await Nutri.findOneAndUpdate(
            { _id: authNutriId },
            update,
            { new: true }
        );

        return res.status(200).json(updatedNutri);
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;
