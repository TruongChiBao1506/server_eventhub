const {default: mongoose} = require('mongoose');

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    locationTitle:{
        type:String,
        required:true,
    },
    locationAddress:{
        type:String,
        required:true,
    },
    position:{
        type: {
			lat: {
				type: Number,
			},
			long: {
				type: Number,
			},
		},
		required: true,
    },
    photoUrl:{
        type:String,
    },
    user:{
        type:[String]
    },
    authorId:{
        type:String,
        required:true,
    },
    startAt:{
        type:Number,
        required:true,
    },
    endAt:{
        type:Number,
        required:true,
    },
    date: {
		type: Number,
		required: true,
	},
    price: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
    createAt:{
        type:Date,
        default:Date.now(),
    },
    updateAt:{
        type:Date,
        default:Date.now(),
    }

});

const EventModel = mongoose.model('events', EventSchema);
module.exports = EventModel;