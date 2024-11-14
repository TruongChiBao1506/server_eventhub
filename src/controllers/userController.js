const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModels');
const EventModel = require('../models/eventModels');

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
        throw new Error('Can not find uid!');
        res.status(404)
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
module.exports = { getAllUsers, getEventFollowed, updateFcmToken, getProfile, getFollowers, updateProfile };