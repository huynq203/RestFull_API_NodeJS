const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    //quyen
    role: {
        type: String,
        default: 'user'
    },
    //gio hang
    cart: {
        type: Array,
        default: []
    },
    //dia chi
    address: [
        { type: mongoose.Types.ObjectId, ref: 'Address' },
    ],
    //danh muc yeu thich
    wishlist: [
        { type: mongoose.Types.ObjectId, ref: 'Wishlist' },
    ],
    //khoa tai khoan
    isBlock: {
        type: Boolean,
        default: false,
    },
    //doi token
    refreshToken: {
        type: String,
    },
    //thoi gian password doi
    passwordChangedAt: {
        type: String
    },
    //gui token password
    passwordResetToken: {
        type: String
    },

    //gioi han thoi gian doi mk
    passwordResetExpires: {
        type: String
    }

}, { timestamps: true });


//trước khi lưu sẽ mã hóa mật khẩu
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const saltRounds = bcrypt.genSaltSync(10);
    //hash password  trước khi lưu
    this.password = await bcrypt.hash(this.password, saltRounds);
});

//check mật khẩu trar về boolean
UserSchema.methods = {

    //so sánh password
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },

    // Dùng thư viện crypto có sẵn trong nodejs để hash 
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        //hash password
        this.passwordResetToken = crypto.createHash('SHA256').update(resetToken).digest('hex');
        //giới hạnh thời gian 15p
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }

};
module.exports = mongoose.model('User', UserSchema, 'users');