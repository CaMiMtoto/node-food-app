const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: false,},
    date: {type: Date, required: true, default: Date.now,},
    status: {type: String, required: true, default: 'pending',},
    address: {type: String, required: true,},
    phone: {type: String, required: true,},
    total: {type: Number, required: true,},
    items: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'Food', required: true,},
            quantity: {type: Number, required: true,},
            price: {type: Number, required: true},
        }
    ]
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

