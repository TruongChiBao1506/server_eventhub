const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModels');
const EventModel = require('../models/eventModels');

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

const handleSendMail = async (val) => {

    try {
        const result = await transporter.sendMail(val);
        console.log(result);

        return 'OK';
    } catch (error) {
        return error;
    }
};
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await UserModel.find({});
    const data = [];
    users.forEach(item => data.push({
        email: item.email ?? '',
        name: item.name ?? '',
        id: item._id ?? ''

    }))

    res.status(200).json({ message: 'Get users successfully!!!', data });
});
const getEventFollowed = asyncHandler(async (req, res) => {
    const { uid } = req.query;
    if (uid) {
        const events = await EventModel.find({ followers: { $all: uid } });
        const ids = [];
        events.forEach(item => ids.push(item.id));

        res.status(200).json({
            message: 'Get event followed successfully!!!',
            data: ids,
        })
    } else {
        res.status(401)
        throw new Error('Missing uid!')
    }
});
const updateFcmToken = asyncHandler(async (req, res) => {
    const { uid, fcmTokens } = req.body;

    await UserModel.findByIdAndUpdate(uid, { fcmTokens })

    res.status(200).json({
        message: 'Update fcm token successfully!!!',
        data: [],
    })
});
const getProfile = asyncHandler(async (req, res) => {
    const { uid } = req.query;
    if (uid) {
        const profile = await UserModel.findOne({ _id: uid });
        res.status(200).json({
            message: 'Get profile successfully!!!',
            data: {
                uid: profile._id,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
                name: profile.name ?? '',
                givenName: profile.givenName ?? '',
                familyName: profile.familyName ?? '',
                email: profile.email ?? '',
                photoUrl: profile.photoUrl ?? '',
                bio: profile.bio ?? '',
                following: profile.following ?? [],
                interests: profile.interests ?? [],
            },
        })
    } else {
        res.status(401)
        throw new Error('Missing uid!')
    }
});

const handleSendNotification = async ({
    token,
    title,
    subtitle,
    body,
    data,
}) => {
    var request = require('request');
    var options = {
        method: 'POST',
        url: 'https://fcm.googleapis.com/v1/projects/evenhub-f8c6e/messages:send',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
            message: {
                token,
                notification: {
                    title,
                    body,
                    subtitle,
                },
                data,
            },
        }),
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(error);

        console.log(response);
    });
};

const getFollowers = asyncHandler(async (req, res) => {
    const { uid } = req.query;
    if (uid) {

        const users = await UserModel.find({ following: { $all: uid } });

        const ids = [];
        if (users.length > 0) {
            users.forEach(user => ids.push(user._id));
        }

        res.status(200).json({
            message: 'Get followers successfully!!!',
            data: ids,
        })
    } else {
        res.status(404)
        throw new Error('Can not find uid!');

    }


});
const updateProfile = asyncHandler(async (req, res) => {
    const body = req.body;
    const { uid } = req.query;
    if (uid && body) {
        await UserModel.findByIdAndUpdate(uid, body);
        res.status(200).json({
            message: 'Update profile successfully!!!',
            data: [],
        })
    } else {
        res.sendStatus(401)
        throw new Error('Missing data!')
    }


});

const updateInterests = asyncHandler(async (req, res) => {
    const body = req.body;
    const { uid } = req.query;
    console.log(uid);

    if (uid && body) {
        await UserModel.findByIdAndUpdate(uid, {
            interests: body
        })

        res.status(200).json({
            message: 'Update interests successfully!!!',
            data: body,
        })
    }
    else {
        res.sendStatus(404);
        throw new Error('Missing data!!!');
    }
});

const toggleFollowing = asyncHandler(async (req, res) => {
    const { uid, authorId } = req.body;
    if (uid && authorId) {
        const user = await UserModel.findById(uid);
        if (user) {
            const { following } = user;

            const items = following ?? [];


            const index = items.findIndex(item => item === authorId);
            if (index !== -1) {
                items.splice(index, 1);

            } else {
                items.push(`${authorId}`);
            }
            await UserModel.findByIdAndUpdate(uid, {
                following: items
            });
            console.log(items);
            res.status(200).json({
                message: 'Toggle following successfully!!!',
                data: items,
            })
        } else {
            res.sendStatus(404);
            throw new Error('user or author not found!!!');

        }
    } else {
        res.sendStatus(404);
        throw new Error('Missing data!!!');
    }


});

const getFollowing = asyncHandler(async (req, res) => {
    const { uid } = req.query;
    if (uid) {

        const user = await UserModel.findById(uid);
        res.status(200).json({
            message: 'Get following successfully!!!',
            data: user.following,
        })
    } else {
        res.status(404)
        throw new Error('Can not find uid!');

    }


});

const pushInviteNotifications = asyncHandler(async (req, res) => {
    const { ids, eventId } = req.body;

    ids.forEach(async (id) => {
        const user = await UserModel.findById(id);

        const fcmTokens = user.fcmTokens;

        if (fcmTokens > 0) {
            fcmTokens.forEach(
                async (token) =>
                    await handleSendNotification({
                        fcmTokens: token,
                        title: 'fasfasf',
                        subtitle: '',
                        body: 'Bạn đã được mời tham gia vào sự kiện nào đó',
                        data: {
                            eventId,
                        },
                    })
            );
        } else {
            // Send mail
            const data = {
                from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
                to: email,
                subject: 'Thư mời tham gia sự kiện',
                text: 'Bạn đã được mời tham gia 1 sự kiện',
                html: `<h1>${eventId}</h1>`,
            };

            await handleSendMail(data);
        }
    });

    res.status(200).json({
        message: 'fafaf',
        data: [],
    });
});
module.exports = { getAllUsers, getEventFollowed, updateFcmToken, getProfile, getFollowers, updateProfile, updateInterests, toggleFollowing, getFollowing, pushInviteNotifications };