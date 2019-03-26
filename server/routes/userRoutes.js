import express from 'express'
import * as UserController from '../controllers/user.controller';
import * as CustomerController from '../controllers/customer.controller';
var router = express.Router();

router.route('/users/').get(UserController.getAll);
router.route('/users/pagination/:page/:limit').get(UserController.getByPagination);
router.route('/users/search/:term/:page/:limit').get(UserController.search);

router.route('/user/:id').get(UserController.getOne);
router.route('/user/create').post(UserController.create);
router.route('/user/update/:id').post(UserController.update);
router.route('/user/delete/:id').delete(UserController.remove);


router.route('/user/login').post(UserController.login);
router.route('/user/register').post(UserController.register);

router.route('/user/authToken').post(UserController.authToken);
router.route('/user/forgotPassword').post(UserController.forgotPassword)
router.route('/user/resetPassword').post(UserController.resetPassword)
router.route('/user/verifyEmail/:token').get(UserController.verifyEmail)
router.route('/user/resendVerifyEmail/:token/:email').get(UserController.resendVerifyEmail)

router.route('/user/customer/shipping/primary/:id').post(CustomerController.updateCustomerPrimaryShipping);
router.route('/user/customer/shipping/update/:id').post(CustomerController.updateCustomerShipping);
router.route('/user/customer/shipping/delete/:id').post(CustomerController.deleteCustomerShipping);

router.route('/user/customer/payment/primary/:id').post(CustomerController.updateCustomerPrimaryPayment);
router.route('/user/customer/payment/create/:id').post(CustomerController.createCustomerPayment);
router.route('/user/customer/payment/delete/:id').post(CustomerController.deleteCustomerPayment);

router.route('/user/customer/wishlist/:id').get(CustomerController.getCustomerWishlist);
router.route('/user/customer/wishlist/push/:id').post(CustomerController.pushCustomerWishlist);
router.route('/user/customer/wishlist/pull/:id').post(CustomerController.pullCustomerWishlist);
router.route('/user/customer/wishlist/delete/:id').delete(CustomerController.deleteCustomerWishlist);

export default router;
