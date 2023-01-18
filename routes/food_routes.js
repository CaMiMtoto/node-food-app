const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Food = require('../models/Food');
router.get('/', async (req, res) => {
    const foods = await Food.find();
    return res
        .send(foods)
        .status(200);
});

router.post('/', async (req, res) => {

    const schema = Joi.object({
        name: Joi.string().required().min(1).max(50),
        price: Joi.number().required(),
        description: Joi.string().required().min(1).max(1000),
        image: Joi.string().required().min(1).max(100),
        amount: Joi.number().required().min(1).max(100),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    const food = new Food({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        amount: req.body.amount
    });
    const result = await food.save();
    if (result) {
        return res
            .send(result)
            .status(201);
    }
    return res
        .send({
            message: 'Error while saving food', status: 500
        })
        .status(500);
});

router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (food) {
        return res
            .send(food)
            .status(200);
    }
    return res
        .send({
            message: 'Food not found', status: 404
        })
        .status(404);
});

router.put('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (food) {
        food.name = req.body.name;
        food.price = req.body.price;
        food.description = req.body.description;
        food.image = req.body.image;
        food.amount = req.body.amount;
        const result = await food.save();
        if (result) {
            return res
                .send(result)
                .status(200);
        }
    }
    return res
        .send({
            message: 'Error while updating food', status: 500
        })
        .status(500);
});

router.delete('/:id', async (req, res) => {
    const result = await Food.deleteOne({_id: req.params.id});
    if (result) {
        return res
            .send({
                message: 'Food deleted successfully', status: 200
            })
            .status(200);
    }
    return res
        .send({
            message: 'Error while deleting food', status: 500
        })
        .status(500);

});

module.exports = router;
