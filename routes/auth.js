let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require('joi');


router.post("/register", async (req, res) => {
    // Validate incoming data
    const schema = Joi.object({
        name: Joi.string().required().min(1).max(50),
        email: Joi.string().required().email().max(50),
        phone: Joi.string().required().min(10).max(15),
        password: Joi.string().required().min(4).max(32),
        address: Joi.string().required().max(50)
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    // Check if email is already registered
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (user) return res.status(400).send({message: "Email already registered"});
        // Hash the password
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) throw err;
            // Create new user instance and save it to the database
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                is_admin: req.body.is_admin,
                password: hashedPassword
            });
            newUser.save((err) => {
                if (err) throw err;
                res.send({message: "Sign up successful"});
            });
        });
    });
});

router.post("/login", (req, res) => {
    // Validate incoming data
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({message: "Email and password are required"});
    }
    // Find the user in the database
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(401).send({message: "Email or password is incorrect"});
        // Compare the hashed passwords
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) return res.status(401).send({message: "Email or password is incorrect"});
            // Create a JWT
            const payload = {email: user.email};
            const token = jwt.sign(payload, "secretKey", {expiresIn: "1h"});
            res.send({message: "Login successful", token});
        });
    });
});

module.exports = router;


