const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { name , email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({name,email, password: hashed, role});
    res.status(201).json({message : "User Created", user});
}

exports.login = async (req,res) => {
    const {email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || !await bcrypt.compare(password,user.password) ){
        return res.status(404).json({ message : "invalid email"});
    };
    

    const token = jwt.sign({ id : user._id }, process.env.JWT_SECRET , { expiresIn : '1d'});

    res.json({ token });
}