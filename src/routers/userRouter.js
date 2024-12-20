
const Router = require('express');
const {getAllUsers, getEventFollowed, updateFcmToken, getProfile, getFollowers, updateProfile, updateInterests, toggleFollowing, getFollowing, pushInviteNotifications} = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/get-followed-events', getEventFollowed)
userRouter.post('/updte-fcmtoken', updateFcmToken);
userRouter.get('/get-profile', getProfile);
userRouter.get('/get-followers', getFollowers);
userRouter.get('/get-following', getFollowing);
userRouter.put('/update-profile', updateProfile);
userRouter.put('/update-interests', updateInterests);
userRouter.put('/update-following', toggleFollowing);
userRouter.post('/send-invite', pushInviteNotifications);
module.exports = userRouter;