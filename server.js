const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require('cors');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const todoListItemsRoutes=require('./api/services/todoLists')

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI,{})
    .then(()=>console.log("database connection success"))
    .catch((err)=>console.log(err));
app.use('/api/todoLists', todoListItemsRoutes)
app.get('/',(request,response)=>{
    request.send("hello");
})
app.listen(3000,()=>{
    console.log("listening from",3000);
})