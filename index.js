const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const foodRoutes = require('./routes/food_routes');
const  authRoutes= require('./routes/auth');

const app = express();

let conString = 'mongodb://localhost:27017/food-app';
if (process.env.NODE_ENV === 'production') {
    conString = 'mongodb+srv://root:N5i5thDO4yhcEbJi@apicluster-i4nmq.gcp.mongodb.net/money?retryWrites=true&w=majority';
}

mongoose.set('strictQuery',true);
mongoose.connect(conString, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('We are now connected to mongodb.')
});

app.use(bodyParser.json());

// routes delegation
app.use('/api/food', foodRoutes);
app.use('/api/auth',authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on , http://localhost:${port}`));


module.exports = app;