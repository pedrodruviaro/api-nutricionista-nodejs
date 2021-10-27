const router = require("express").Router();
const bcrypt = require("bcrypt");
const Nutri = require("../models/Nutri");
const AuthValidation = require("../common/validations");

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

module.exports = router;
