import express from 'express'
import * as OrderController from '../controllers/order.controller';

var router = express.Router();

router.route('/orders').get(OrderController.getAll);

router.route('/orders/pagination/:page/:limit').get(OrderController.getByPagination);
router.route('/orders/search/:term/:page/:limit').get(OrderController.search);

router.route('/order/:id').get(OrderController.getOne);
router.route('/order/guest/:id').get(OrderController.getByGuest);
router.route('/orders/user/:id').get(OrderController.getByUser);

router.route('/order/create/:userId').post(OrderController.createCustomerOrder);
router.route('/order/guest/create/').post(OrderController.createGuestOrder);

router.route('/order/update/:id/messages').post(OrderController.updateMessages)
router.route('/order/update/:id').post(OrderController.update);
router.route('/order/delete/:id').delete(OrderController.remove);

router.route('/scrape/:url').get(OrderController.scrape);

export default router;
