const productCategoryModel = require('../models/productCategory');
const asyncHandle = require('express-async-handler');
const pagnigation = require('../../libs/pagnigation');

const getCategories = asyncHandle(async (req, res) => {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const response = await productCategoryModel
        .find()
        .sort({ _id: -1 })
        .select('title _id')
        .limit(limit)
        .skip(skip);
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Get product-category success' : 'Get product-category failed',
            data: response ? response : 'Not data',
            pages: await pagnigation(productCategoryModel, query, page, limit),
        });
});

const createCategory = asyncHandle(async (req, res) => {
    const response = await productCategoryModel(req.body).save();
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Insert ProCategory success' : 'Insert ProCategory failed',
            data: response ? response : 'Not data'
        });
});

const updateCategory = asyncHandle(async (req, res) => {
    const { cid } = req.params;
    if (!req.body.title) throw new Error('Missing inputs');
    const response = await productCategoryModel.findByIdAndUpdate(cid, req.body, { new: true });
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Updated success' : 'Updated failed',
            data: response ? response : 'Not data'
        })
})
const deleteCategory = asyncHandle(async (req, res) => {
    const { cid } = req.params;
    const response = await productCategoryModel.findByIdAndDelete(cid);
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Deleted success' : 'Deleted failed',
        })
})




module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
