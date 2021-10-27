const router = require("express").Router();
const verifyToken = require("../common/verifyToken");

router.post("/new", verifyToken, async (req, res) => {
    console.log("entrou na rota");
});

module.exports = router;
