const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModels');

const getAllUsers = asyncHandler(async (req, res) => {
    
    const users = await UserModel.find({});
    const data = [];
    users.forEach(item => data.push({
        email: item.email ?? '',
        name: item.name ?? '',
        id: item._id ?? ''

    }))
    
    res.status(200).json({message: 'Get users successfully!!!', data});
});

module.exports = {getAllUsers};