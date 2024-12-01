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
    // const { lat, lon, distance, limit, date } = req.query;

    // const events = await EventModel.find({}).sort({ createdAt: -1 }).limit(limit ?? 0);
    const { lat, long, distance, limit, startAt, endAt, date, categoryId, isUpcoming, isPastEvents, title, minPrice, maxPrice } = req.query;
    const filter = {}
	
	if (categoryId) {
		if (categoryId.includes(',')) {
			filter.category = {$in: categoryId.split(',')}
		}else{
			filter.category = {$eq: categoryId}
		}
	}

	if (startAt && endAt) {
		filter.startAt = {$gt: new Date(startAt).getTime()}
		filter.endAt = {$lt: new Date(endAt).getTime()}
	}
		
	if (isUpcoming) {
		filter.startAt = {$gt: Date.now()}
	}

	if (isPastEvents) {
		filter.endAt = {$lt: Date.now()}
	}

	if (title) {
		filter.title = {$regex: title}
	}

	if (maxPrice && minPrice) {
		filter.price = {$lte: parseInt(maxPrice), $gte: parseFloat(minPrice)}
	}

	const events = await EventModel.find(filter)
		.sort({ createdAt: -1 })
		.limit(limit ?? 0);

    res.status(200).json({
        message: 'get Events Ok',
        data: date ? events.filter((element) => element.date > new Date(date)) : events,
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
const getEventById = asyncHandler(async (req, res) => {
	const { id } = req.query;

	const item = await EventModel.findById(id);

	res.status(200).json({
		message: 'Event detail',
		data: item ? item : [],
	});
});
const searchEvents = asyncHandler(async (req, res) => {
	const { title } = req.query;

	const events = await EventModel.find({});

	const items = events.filter((element) =>
		element.title.toLowerCase().includes(title.toLocaleLowerCase())
	);


	res.status(200).json({
		message: 'get events ok',
		data: items,
	});
});
const getEventsByCategoyId = asyncHandler(async (req, res) => {
	const { categoryId, minPrice, maxPrice } = req.query;
	const items = await EventModel.find({ category: { $all: categoryId } });

	res.status(200).json({
		message: 'get Events by categories successfully!!!',
		data: items,
	});
   // Kiểm tra và chuyển đổi giá trị minPrice và maxPrice
//    const priceQuery = {};
//    if (minPrice) priceQuery.$gte = Number(minPrice);
//    if (maxPrice) priceQuery.$lte = Number(maxPrice);

//    try {
//        // Tạo query động
//        const query = {};

//        // Chỉ thêm điều kiện category nếu categoryId tồn tại
//        if (categoryId) {
//            query.category = { $all: categoryId };
//        }

//        // Thêm điều kiện price nếu có
//        if (Object.keys(priceQuery).length > 0) {
//            query.price = priceQuery;
//        }

//        // Tìm dữ liệu dựa trên query
//        const items = await EventModel.find(query);

//        res.status(200).json({
//            message: 'Get Events successfully!',
//            data: items,
//        });
//    } catch (error) {
//        res.status(500).json({
//            message: 'Failed to get events',
//            error: error.message,
//        });
//    }
});
module.exports = { addNewEvent, getEvents, updateFollowers, getFollowers, createCategory,getCategories, searchEvents, getEventById, getEventsByCategoyId };