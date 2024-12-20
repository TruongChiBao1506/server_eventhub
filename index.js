const express = require('express');

const cors = require('cors');
const authRouter = require('./src/routers/authRouter');
const connectDB = require('./src/configs/connectDb');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const userRouter = require('./src/routers/userRouter');
const { verification } = require('./src/controllers/authController');
const verifyToken = require('./src/middlewares/VerifyMiddleware');
const eventRouter = require('./src/routers/eventRouter');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
const PORT = 3001;

// app.get('/hello',(_req, res)=>{
//     res.send('<h1>Hello World</h1>');
// })
app.use('/auth', authRouter);
app.use('/users', verifyToken,userRouter);
app.use('/events', verifyToken,eventRouter);
connectDB();    

app.use(errorMiddleware);

app.listen(PORT, (err) => {
    if (err){
        console.log(err);
        return;
    }

    console.log(`Server starting at http://localhost:${PORT}`);
    
});
