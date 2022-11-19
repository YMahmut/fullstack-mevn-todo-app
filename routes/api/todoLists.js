const Router = require('express');
const TodoList = require("../../models/TodoList");

const router = Router();
router.get('/', async (req, res) => {
    try {
        const todoListAllItems = await TodoList.find();
        if (!!todoListAllItems) {
            res.status(200).json(todoListAllItems);
        } else {
            throw new Error('There is no todo item');
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const newTodoItem = new TodoList(req.body);
    try {
        const todoListItem = await newTodoItem.save();
        if (!!todoListItem) {
            res.status(200).json(todoListItem);
        } else {
            throw new Error('error occurred when saving new item')
        }

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const response = await TodoList.findByIdAndUpdate(id, req.body)
        if (!!response) {
            const updated = {...response._doc, ...req.body}
            res.status(200).json(updated)
        } else throw new Error('Something went wrong ');
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const removed = await TodoList.findByIdAndDelete(id)
        if (!!removed)
            res.status(200).json(removed);
        else throw new Error('Something went wrong ')
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router;