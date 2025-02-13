const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Registrasi user
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Nama wajib diisi"),
        body("email").isEmail().withMessage("Email tidak valid"),
        body("password").isLength({min: 6}).withMessage("Password minimal 6 karakter")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const {name, email, password} = req.body;

        try{
            let user = await User.findOne({email});
            if (user) return res.status(400).json({ msg: "Email sudah terdaftar"});

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword});

            await user.save();

            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});
            res.json({token});
        } catch (err) {
            res.status(500).json({ msg: "Server error"});
        }
    } 
);

// Login
router.post(
    "/login",
    async (req, res) => {
        const {email, password } = req.body;
        
        try{
            let user = await User.findOne({ email });
            // res.status(200).json(user);
            if(!user) return res.status(400).json({ msg: "User tidak ditemukan"});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({ msg: "Password salah"});

            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});

            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // Set ke true jika menggunakan HTTPS
                sameSite: "strict",
                maxAge: 3600000, // 1 jam
            });

            res.json({token});
        } catch (err) {
            res.status(500).json({ msg: "Server error"});
        }
    }
);

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ msg: "Logout berhasil"});
});

module.exports = router;