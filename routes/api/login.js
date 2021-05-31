const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");
const User = require("../../models/User");

// @route    POST api/login
// Login Route - In req.body, send email,password and get back an access token.
router.post(
    "/",
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            let user = await User.findOne({email});

            if (!user) {
                return res
                    .status(400)
                    .json({errors: [{msg: "Invalid Credentials"}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({errors: [{msg: "Invalid Credentials"}]});
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                "secretkey",
                {expiresIn: "5 days"},
                (err, token) => {
                    if (err) throw err;
                    res.json({token});
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
