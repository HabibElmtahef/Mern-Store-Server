const Category = require('../models/categoryModel')

const CategoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (error) {
            
        }
    },
    addCategory: async (req, res) => {
        try {
            const {name} = req.body
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg: "This Category is Already Exist"})

            const newCategory = new Category({name})
            await newCategory.save()
            res.json(newCategory)
        } catch (error) {
            
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {name} = req.body
            await Category.findOneAndUpdate({_id: req.params.id}, {name})
            res.json({msg: "updated with Success"})
        } catch (error) {
            
        }
    }
}


module.exports = CategoryCtrl