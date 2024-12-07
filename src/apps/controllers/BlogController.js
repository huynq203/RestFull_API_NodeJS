const blogModel = require('../models/blog');
const asyncHandle = require('express-async-handler');


const getBlogs = asyncHandle(async (req, res) => {
    const response = await blogModel.find()
        .populate('likes', '_id fullname email phone')
        .populate('dislikes', '_id fullname email phone')
        .sort({ _id: -1 })
        .select('-isLiked -idDisliked ');
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Get blog success' : 'Get blog failed',
            blogs: response ? response : 'null'
        })

});
const getBlogbyId = asyncHandle(async (req, res) => {
    const { bid } = req.params;
    const response = await blogModel.findById(bid)
        .populate('likes', '_id fullname email phone')
        .populate('dislikes', '_id fullname email phone');
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Get blog by id success' : 'Get blog failed',
            blogs: response ? response : 'null'
        })
})

const createBlog = asyncHandle(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('Missing Inputs');
    const response = await blogModel(req.body).save();
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Insert Blog Success' : 'Insert Blog Failed',
            createBlog: response ? response : 'null'
        })
})
const updateBlog = asyncHandle(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inputs');
    const response = await blogModel.findByIdAndUpdate(bid, req.body, { new: true });
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'false',
            mes: response ? 'Updated success' : 'Updated failed',
            updateBlog: response ? response : 'null'
        })
})
const deleteBlog = asyncHandle(async (req, res) => {
    const { bid } = req.params;
    const response = await blogModel.findByIdAndDelete(bid);
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'false',
            mes: response ? 'Deleted success' : 'Deleted failed',
            updateBlog: response ? response : 'null'
        })
})

//Khi người dùng like 1 blog:
//1.Check xem người dùng đó dislike hay chưa => bỏ dislike
//2.Check xem người dùng trước đó có like hay không => bỏ like / thêm like

const likeBlog = asyncHandle(async (req, res) => {
    const uid = req.user._id;
    const { bid } = req.params;
    const blog = await blogModel.findById(bid);

    //check người dùng đã dislike hay chưa
    const alreadyDisliked = blog.dislikes.find(el => el.toString() === uid);
    if (alreadyDisliked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { dislikes: uid }, $push: { likes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');
        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    }

    //check người dùng đã like hay chưa
    const isLiked = blog.likes.find(el => el.toString() === uid);
    if (isLiked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { likes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');
        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    } else {
        const response = await blogModel.findByIdAndUpdate(bid, { $push: { likes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');
        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    }
});

const disLikeBlog = asyncHandle(async (req, res) => {
    const uid = req.user._id;
    const { bid } = req.params;
    const blog = await blogModel.findById(bid);

    const alreadyLiked = blog.likes.find(el => el.toString() === uid);
    if (alreadyLiked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { likes: uid }, $push: { dislikes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');

        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    }
    const dislikes = blog.dislikes.find(el => el.toString() === uid);
    if (dislikes) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { dislikes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');
        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    } else {
        const response = await blogModel.findByIdAndUpdate(bid, { $push: { dislikes: uid } }, { new: true })
            .populate('likes', '_id fullname email phone')
            .populate('dislikes', '_id fullname email phone');
        return res
            .status(200)
            .json({
                status: response ? 'success' : 'failed',
                result: response ? response : 'null'
            })
    }
})


module.exports =
{
    getBlogs,
    getBlogbyId,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog
}