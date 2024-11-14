const {default: mongoose} = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
		type: String,
	},
	givenName: {
		type: String,
	},
	familyName: {
		type: String,
	},
	bio: {
		type: String,
	},
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    photoUrl:{
        type:String,
    },
    createAt:{
        type:Date,
        default:Date.now(),
    },
    updateAt:{
        type:Date,
        default:Date.now(),
    },
    fcmTokens:{
        type: [String],
    },
    following: {
		type: [String],
	},
	followers: {
		type: [String],
	},
	interests: {
		type: [String],
	}
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;