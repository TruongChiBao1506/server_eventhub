
const Router = require('express');
const {getAllUsers, getEventFollowed, updateFcmToken, getProfile, getFollowers, updateProfile, updateInterests, toggleFollowing} = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/get-followed-events', getEventFollowed)
userRouter.post('/updte-fcmtoken', updateFcmToken);
userRouter.get('/get-profile', getProfile);
userRouter.get('/get-followers', getFollowers);
userRouter.put('/update-profile', updateProfile);
userRouter.put('/update-interests', updateInterests);
userRouter.put('/update-following', toggleFollowing);
module.exports = userRouter;