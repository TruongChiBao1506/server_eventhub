const asyncHandler = require('express-async-handler');
const EventModel = require('../models/eventModels');
const CategoryModel = require('../models/categoryModel');


const addNewEvent = asyncHandler(async (req, res) => {
    const body = req.body;
    if (body) {
        const newEvent = new EventModel(body);
        console.log(newEvent);
        newEvent.save();


        res.status(200).json({
            message: 'Added new event successfully',
            data: newEvent,
        });
    } else {
        res.status(401)
        throw new Error('Event data not found!!!');
    }

});

const getEvents = asyncHandler(async (req, res) => {
    const { lat, lon, distance, limit, date } = req.query;

    const events = await EventModel.find({}).sort({ createdAt: -1 }).limit(limit ?? 0);

    res.status(200).json({
        message: 'get Events Ok',
        data: date ? events.filter((element) => element.date < new Date(date)) : events,
    });

});
const updateFollowers = asyncHandler(async (req, res) => {
    const body = req.body;
    const { id, followers } = body;
    console.log(body);

    await EventModel.findByIdAndUpdate(id, { followers, updateAt: Date.now() });

    res.status(200).json({
        mess: 'update followers successfully!!!',
        data: [],
    })
})
const getFollowers = asyncHandler(async (req, res) => {

    const { id } = req.query;

    const event = await EventModel.findById(id);
    if (event) {
        res.status(200).json({
            mess: 'get followers successfully!!!',
            data: event.followers ?? [],
        });
    }else{
        res.status(401);
        throw new Error('Event not found!!!');
    }
});

const createCategory = asyncHandler(async (req, res) => {
    const data = req.body;
    const newCategory = new CategoryModel(data);
    
    newCategory.save();
    res.status(200).json({
        message: 'Create category successfully!!!',
        data: newCategory,
    })
});

const getCategories = asyncHandler(async (req, res) => {
    const items = await CategoryModel.find({});
    res.status(200).json({
        message: 'Get categories successfully!!!',
        data: items,
    });
});
module.exports = { addNewEvent, getEvents, updateFollowers, getFollowers, createCategory,getCategories };