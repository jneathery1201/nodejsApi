const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const validate = require('../validation');
const jwt = require('jsonwebtoken');

//register
router.post('/register', async (req, res) => {
    //validate
    const errorMsg = validate.registerValidation(req.body);
    if(errorMsg) return res.status(400).send(errorMsg);

    //check if user exists
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send("User with that email already exists.");

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        //create and assign token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //validate
    const errorMsg = validate.loginValidation(req.body);
    if(errorMsg) return res.status(400).send(errorMsg);

    //check if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email or Password is wrong.");

    //check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Email or Password is wrong.");

    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


module.exports = router;