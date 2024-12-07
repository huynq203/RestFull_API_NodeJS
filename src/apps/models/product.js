const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,

    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },

    //nhãn hàng thương hiệu
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'productCategory',
    },
    quantity: {
        type: Number,
        default: 0,
    },
    //Số lượng mặt hàng đã bán
    sold: {
        type: Number,
        default: 0
    },
    imageCover: {
        type: String
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: ['Black', 'Red', 'White']
    },
    //Đánh giá
    ratings: [
        {
            star: {
                type: Number
            },
            postedBy: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String
            }
        }
    ],
    //Tổng đánh giá
    totalRatings: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'products');