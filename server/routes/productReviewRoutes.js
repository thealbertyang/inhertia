import express from 'express'
import * as ProductReviewController from '../controllers/productReview.controller';
import { Stripe } from 'stripe'

var router = express.Router();

router.route('/productReviews').get(ProductReviewController.getAll);
router.route('/productReviews/pagination/:page/:limit').get(ProductReviewController.getByPagination);
router.route('/productReviews/search/:term/:page/:limit').get(ProductReviewController.search);
router.route('/productReviews/product/:id').get(ProductReviewController.getByProduct);

router.route('/productReview/:id').get(ProductReviewController.getOne);
router.route('/productReview/create').post(ProductReviewController.create);
router.route('/productReview/update/:id').post(ProductReviewController.update);
router.route('/productReview/delete/:id').delete(ProductReviewController.remove);

export default router;
