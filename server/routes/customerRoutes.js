import express from 'express'
import * as CustomerController from '../controllers/customer.controller';

var router = express.Router();

// Get all Model
router.route('/customers').get(CustomerController.getAll);

router.route('/customers/pagination/:page/:limit').get(CustomerController.getByPagination);
router.route('/customers/search/:term/:page/:limit').get(CustomerController.search);


router.route('/customer/:id').get(CustomerController.getOne);
router.route('/customer/create').post(CustomerController.create);
router.route('/customer/update/:id').post(CustomerController.update);
router.route('/customer/delete/:id').delete(CustomerController.remove);

router.route('/customer/user/:id').get(CustomerController.getByUserId);

router.route('/customer/login').post(CustomerController.login);
router.route('/customer/register').post(CustomerController.register);

router.route('/customer/wishlist/:id').get(CustomerController.getCustomerWishlist);
router.route('/customer/wishlist/push/:id').post(CustomerController.pushCustomerWishlist);
router.route('/customer/wishlist/pull/:id').post(CustomerController.pullCustomerWishlist);
router.route('/customer/wishlist/delete/:id').delete(CustomerController.deleteCustomerWishlist);

router.route('/customer/payment/primary/:id').post(CustomerController.updateCustomerPrimaryPayment);
router.route('/customer/payment/create/:id').post(CustomerController.createCustomerPayment);
router.route('/customer/payment/delete/:id').post(CustomerController.deleteCustomerPayment);

router.route('/customer/shipping/primary/:id').post(CustomerController.updateCustomerPrimaryShipping);
router.route('/customer/shipping/update/:id').post(CustomerController.updateCustomerShipping);
router.route('/customer/shipping/delete/:id').post(CustomerController.deleteCustomerShipping);

export default router;


