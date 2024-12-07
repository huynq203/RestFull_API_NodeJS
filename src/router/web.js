const express = require("express");
const router = express.Router();
const UserController = require('../apps/controllers/UserController');
const ProductController = require('../apps/controllers/ProductController');
const ProductCategoryController = require('../apps/controllers/ProductCategoryController');
const BlogController = require('../apps/controllers/BlogController.js');
const { verifyAccessToken, isAdmin } = require('../apps/middlewares/verifyToken');


// admin vs user dùng chung
router.post("/api/v2/user/register", UserController.register);
router.post("/api/v2/user/login", UserController.login);
router.get("/api/v2/user/current", verifyAccessToken, UserController.current);

//Cap nhat trang ca nhan
router.put("/api/v2/user/current/update", [verifyAccessToken], UserController.updateUser);
router.post("/api/v2/user/refreshToken", UserController.refreshToken);
router.post("/api/v2/user/logout", UserController.logout);
router.get("/api/v2/user/forgot-password", UserController.forgotPassword);
router.put("/api/v2/user/reset-password/:token", UserController.resetPassword);

//chi admin dùng
router.get("/api/v2/user/", UserController.getUsers);
router.delete("/api/v2/user/delete/:uid", [verifyAccessToken, isAdmin], UserController.deleteUserbyAdmin);
router.put("/api/v2/user/update/:uid", [verifyAccessToken, isAdmin], UserController.updateUserbyAdmin);


//Product
router.get("/api/v2/product/:pid", ProductController.getProductbyId);
router.get("/api/v2/product", ProductController.getProducts);
router.post("/api/v2/product/store", [verifyAccessToken, isAdmin], ProductController.createProduct);
router.put("/api/v2/product/update/:pid", [verifyAccessToken, isAdmin], ProductController.updateProduct);
router.delete("/api/v2/product/delete/:pid", [verifyAccessToken, isAdmin], ProductController.deleteProduct);
router.put("/api/v2/product/rating/:pid", [verifyAccessToken], ProductController.ratings);

//ProductCategory
router.get("/api/v2/productCategory/", ProductCategoryController.getCategories);
router.post("/api/v2/productCategory/store", [verifyAccessToken, isAdmin], ProductCategoryController.createCategory);
router.put("/api/v2/productCategory/update/:cid", [verifyAccessToken, isAdmin], ProductCategoryController.updateCategory);
router.delete("/api/v2/productCategory/delete/:cid", [verifyAccessToken, isAdmin], ProductCategoryController.deleteCategory);

//Blog
router.get("/api/v2/blog/", BlogController.getBlogs);
router.get("/api/v2/blog/:bid", BlogController.getBlogbyId);
router.post("/api/v2/blog/store", [verifyAccessToken, isAdmin], BlogController.createBlog);
router.put("/api/v2/blog/update/:bid", [verifyAccessToken, isAdmin], BlogController.updateBlog);
router.delete("/api/v2/blog/delete/:bid", [verifyAccessToken, isAdmin], BlogController.deleteBlog);
router.put("/api/v2/blog/like/:bid", [verifyAccessToken], BlogController.likeBlog);
router.put("/api/v2/blog/dislike/:bid", [verifyAccessToken], BlogController.disLikeBlog);

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
//CREATE(POST) + PUT : body
//GET + DELETE : query

module.exports = router;