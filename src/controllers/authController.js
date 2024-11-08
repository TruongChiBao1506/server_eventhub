const UserModel = require("../models/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD,
    },
});

const getJsonWebToken = async (email, id) => {

    const payload = {
        email, id
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d',
    });



    return token;
}

const handleSendMail = async (val) => {

    try {
        const result = await transporter.sendMail(val);
        console.log(result);

        return 'OK';
    } catch (error) {
        return error;
    }
};

const verification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const verificationCode = Math.round(1000 + Math.random() * 9000);



    try {
        const data = {
            from: `Support EventHub Application <${process.env.USERNAME_EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: "Verification email code", // Subject line
            text: "Your code to verification email", // plain text body
            html: `<h1>${verificationCode}</h1>`, // html body
        };
        await handleSendMail(data);
        res.status(200).json({
            message: "Send verification code successfully!!!",
            data: {
                code: verificationCode,
            }
        })
    } catch (error) {
        res.status(401);
        throw new Error("Can't send email");
    }



});

const register = asyncHandler(async (req, res) => {
    const { email, fullname, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    // console.log(existingUser);

    if (existingUser) {
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




    res.status(200).json({
        message: "register new user successfully",
        data: {
            email: newUser.email,
            id: newUser._id,
            accesstoken: await getJsonWebToken(email, newUser._id),
        }
    });

});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });


    if (!existingUser) {
        res.status(403);
        throw new Error("User not found");
    }
    const isMatchPassword = await bcrypt.compare(password, existingUser.password);

    if (!isMatchPassword) {
        res.status(401);
        throw new Error("Email or Password is not correct");
    }
    res.status(200).json({
        message: "login successfully",
        data: {
            id: existingUser._id,
            email: existingUser.email,
            accesstoken: await getJsonWebToken(email, existingUser._id),
        },
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const randomPassword = Math.round(100000 + Math.random() * 900000);

    const data = {
        from: `New Password <${process.env.USERNAME_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "New Password", // Subject line
        text: "Your new password to verification email", // plain text body
        html: `<h1>${randomPassword}</h1>`, // html body
    };

    const user = await UserModel.findOne({ email });
    if (user) {
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(`${randomPassword}`, salt);

        await UserModel.findByIdAndUpdate(user._id, { password: hasedPassword, isChangedPassword: true })
            .then(() => console.log('Done')).catch((error) => console.log(error));
        await handleSendMail(data).then(() => {
            res.status(200).json({
                message: "Send mail new password successfully!!!",
                data: {}
            });
        }).catch((error) => {
            res.status(401);
            throw new Error("Can't send email");
        });
    } else {
        res.status(401);
        throw new Error("User not found!!!");
    }
});

// const handleLoginWithGoogle = asyncHandle(async (req, res) => {
//     const userInfo = req.body;

//     const existingUser = await UserModel.findOne({ email: userInfo.email });
//     let user;
//     if (existingUser) {
//         await UserModel.findByIdAndUpdate(existingUser.id, {
//             updatedAt: Date.now(),
//         });
//         user = { ...existingUser };
//         user.accesstoken = await getJsonWebToken(userInfo.email, userInfo.id);

//         if (user) {
//             const data = {
//                 accesstoken: user.accesstoken,
//                 id: existingUser._id,
//                 email: existingUser.email,
//                 fcmTokens: existingUser.fcmTokens,
//                 photo: existingUser.photoUrl,
//                 name: existingUser.name,
//             };

//             res.status(200).json({
//                 message: 'Login with google successfully!!!',
//                 data,
//             });
//         } else {
//             res.sendStatus(401);
//             throw new Error('fafsf');
//         }
//     } else {
//         const newUser = new UserModel({
//             email: userInfo.email,
//             fullname: userInfo.name,
//             ...userInfo,
//         });
//         await newUser.save();
//         user = { ...newUser };
//         user.accesstoken = await getJsonWebToken(userInfo.email, newUser.id);

//         if (user) {
//             res.status(200).json({
//                 message: 'Login with google successfully!!!',
//                 data: {
//                     accesstoken: user.accesstoken,
//                     id: user._id,
//                     email: user.email,
//                     fcmTokens: user.fcmTokens,
//                     photo: user.photoUrl,
//                     name: user.name,
//                 },
//             });
//         } else {
//             res.sendStatus(401);
//             throw new Error('fafsf');
//         }
//     }
// });

module.exports = { register, login, verification, forgotPassword };