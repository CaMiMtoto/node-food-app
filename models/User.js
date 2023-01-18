const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    orders: [{type: Schema.Types.ObjectId, ref: 'Order', required: false}],
    is_admin: {type: Boolean, required: false, default: false},
});

const User = mongoose.model('User', userSchema);
module.exports = User;