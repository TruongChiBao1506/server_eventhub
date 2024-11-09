const asyncHandler = require('express-async-handler');
const EventModel = require('../models/eventModels');


const addNewEvent = asyncHandler(async (req, res) => {
    const body = req.body;
    if(body){
        const newEvent = new EventModel(body);
        newEvent.save();
        console.log(newEvent);
        
        res.status(200).json({
            message: 'Added new event successfully',
            data:newEvent,
        });
    }else{
        res.status(401)
        throw new Error('Event data not found!!!');
    }
    
});

module.exports = {addNewEvent};