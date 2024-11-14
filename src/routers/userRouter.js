
const Router = require('express');
const {getAllUsers, getEventFollowed, updateFcmToken} = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/get-followed-events', getEventFollowed)
userRouter.post('/updte-fcmtoken', updateFcmToken);
module.exports = userRouter;