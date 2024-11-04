const UserModel = require("../models/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const getJsonWebToken = async (email, id) => {

    const payload = {
        email,id
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY,{
        expiresIn: '7d',
    });
    
    

    return token;
}

const register = asyncHandler(async (req, res) => {
    const {email, fullname, password} = req.body;
    const existingUser = await UserModel.findOne({email});

    // console.log(existingUser);

    if(existingUser){
        res.status(401);
        throw new Error("User has already exists!!!");
    }
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        email,
        fullname: fullname ?? '',
        password: hasedPassword,
    });
    await newUser.save();



    
    res.status(200).json({message: "register new user successfully", 
        data: {
            email: newUser.email,
            id: newUser._id,
            accesstoken: await getJsonWebToken(email, newUser._id),
        }});
    
});

const login = asyncHandler(async (req, res) => {
    const {email,password} = req.body;

    const existingUser = await UserModel.findOne({email});

    
    if(!existingUser){
        res.status(403);
        throw new Error("User not found");
    }
    const isMatchPassword = await bcrypt.compare(password, existingUser.password);

    if(!isMatchPassword){
        res.status(401);
        throw new Error("Email or Password is not correct");
    }
    res.status(200).json({message: "login successfully",
        data:{
            id: existingUser._id,
            email: existingUser.email,
            accesstoken: await getJsonWebToken(email, existingUser._id),
        },
    });
});

module.exports = {register, login};