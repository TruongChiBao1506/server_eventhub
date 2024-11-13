
const Router = require('express');
const {getAllUsers, getEventFollowed} = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/get-followed-events', getEventFollowed)

module.exports = userRouter;