const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserData = require('../models/User');

//register

router.post('/registe', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ msg: 'Please Enter All Fields' });
        }

        let user = await UserData.findOne({ email });
        if (user) return res.status(401).json({ msg: 'User Already Exists' });

        user = new UserData({ name, email, password });
        await user.save();

        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please Enter All Fields' });
        const user = await UserData.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid User details' });

        const isMatch = await user.comaprePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Please Enter Valid Password" });
        const payload = { user: { id: user._id } }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        console.error(err.message);
        res.Status(500).send('Server Error');
    }
})

const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await UserData.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.Status(500).send('Server Error');
    }
})