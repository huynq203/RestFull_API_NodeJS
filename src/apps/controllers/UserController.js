const userModel = require('../models/user');
const asyncHandle = require('express-async-handler');
const { AccessToken, RefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../../libs/sendmail');

//asyncHandle để thay cho try_catch
const register = asyncHandle(async (req, res) => {
    const { fullname, email, phone, password } = req.body;
    if (!fullname || !email || !phone || !password) {
        return res
            .status(400)
            .json({
                status: 'failed',
                mes: "Missing inputs"
            })
    }
    const user = await userModel.findOne({ email });
    if (user) {
        throw new Error('User has been registered');
    } else {
        const newUser = await userModel(req.body).save();
        return res
            .status(200)
            .json({
                status: newUser ? 'success' : 'failed',
                mes: newUser ? "Register success" : "Register falied"
            })
    }
})

//RefreshToken => Cấp mới Access Token
//AccessToken => Xác thực người dùng,phân quyền người dùng
const login = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({
                status: 'failed',
                mes: "Missing inputs"
            })
    }
    const user = await userModel.findOne({ email });
    //check co trong db va dung mat khau
    if (user) {
        if (await user.isCorrectPassword(password)) {
            const { password, role, refreshToken, ...userData } = user.toObject();
            //khoi tao Token 
            const accessToken = AccessToken(user._id, role);
            //Tao refreshToken vao db
            const newrefreshToken = RefreshToken(user._id);
            //Lưu refreshToken vào db
            await userModel.findByIdAndUpdate(user._id, { refreshToken: newrefreshToken }, { new: true });
            res.cookie('refreshToken', newrefreshToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
            return res
                .status(200)
                .json({
                    status: 'success',
                    userData,
                    accessToken
                })
        } else {
            throw new Error('Invalid account or password')
        }
    } else {
        throw new Error('Login failed');
    }
})

//trang ca nhan
const current = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    const user = await userModel.findById(_id).select('-refreshToken -password -role');
    return res
        .status(200)
        .json({
            status: user ? 'success' : 'failed',
            result: user ? user : 'Notfound user'
        })
})

const refreshToken = asyncHandle(async (req, res) => {
    //lay token từ cookie
    const cookie = req.cookies;
    //check xem co token hay khong
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No refresh token in cookies');
    }
    // //check token(id) đã lưu vào db co hop le hay khong
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const user = await userModel.findOne({ refreshToken: cookie.refreshToken });
    return res
        .status(200)
        .json({
            status: user ? 'success' : 'failed',
            //tạo mới token(id,role)
            newAccessToken: user ? AccessToken(user._id, user.role) : 'Refresh token not matched'
        })
})

const logout = asyncHandle(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No refresh Token in cookies');
    }
    await userModel.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res
        .status(200)
        .json({
            status: 'success',
            mes: 'Logout is done'
        })
})

//Nhap mail de gui mail
const forgotPassword = asyncHandle(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error('Missing Email');
    const user = await userModel.findOne({ email });
    if (!user) throw new Error('User Not found');
    const resetToken = user.createPasswordChangedToken();
    await user.save();
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn trong 15p
                    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Click here </a>
                    `;
    const result = await sendMail(email, html);
    res
        .status(200)
        .json({
            status: 'success',
            result
        })
})

//Nhap mat khau mới
const resetPassword = asyncHandle(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) throw new Error('Missing Inputs');

    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) throw new Error('Email timeout');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    return res
        .status(200)
        .json({
            status: user ? 'success' : 'failed',
            mes: user ? "Updated Password" : "Something went wrong"
        })
})

const getUsers = asyncHandle(async (req, res) => {
    const response = await userModel
        .find()
        .sort({ _id: -1 })
        .select('-refreshToken -password');
    res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Get data success' : 'Get data failed',
            data: response ? response : 'Some thing went wrong'
        })
})

const updateUser = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    if (!_id || !Object.keys(req.body).length === 0) throw new Error('Missing input');
    const response = await userModel.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role');
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Updated success' : 'Updated failed',
            data: response ? response : 'Some thing went wrong',
        })
})


const deleteUserbyAdmin = asyncHandle(async (req, res) => {
    const { uid } = req.params;
    if (!ud) throw new Error('Missing id');
    const response = await userModel.findByIdAndDelete(uid);
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? `User with email ${response.email} deleted` : 'No user delete',
        })
})

const updateUserbyAdmin = asyncHandle(async (req, res) => {
    const { uid } = req.params;
    if (!uid || !Object.keys(req.body).length === 0) throw new Error('Missing input');
    const response = await userModel.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role');
    return res
        .status(200)
        .json({
            status: response ? 'success' : 'failed',
            mes: response ? 'Updated success' : 'Updated failed',
            data: response ? response : 'Some thing went wrong',
        })
})


module.exports = {
    register,
    login,
    current,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    updateUser,
    updateUserbyAdmin,
    deleteUserbyAdmin

}