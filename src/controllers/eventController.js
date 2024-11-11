const asyncHandler = require('express-async-handler');
const EventModel = require('../models/eventModels');


const addNewEvent = asyncHandler(async (req, res) => {
    const body = req.body;
    if(body){
        const newEvent = new EventModel(body);
        console.log(newEvent);
        newEvent.save();
        
        
        res.status(200).json({
            message: 'Added new event successfully',
            data:newEvent,
        });
    }else{
        res.status(401)
        throw new Error('Event data not found!!!');
    }
    
});

const getEvents = asyncHandler(async (req, res)=>{
    const {lat, lon, distance,limit} = req.query;
    const events = await EventModel.find({}).sort({ createdAt: -1 }).limit(limit ?? 0);
    
    res.status(200).json({
        message:'get Events Ok',
        data:events,
    });
    
});

module.exports = {addNewEvent, getEvents};