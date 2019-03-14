import express from 'express'
import * as ProductController from '../controllers/product.controller';
import { Stripe } from 'stripe'

let stripe = Stripe("sk_test_j3lePUHaf2fguMotCLXrQMHx");

var router = express.Router();

router.route('/products').get(ProductController.getAll);
router.route('/products/pagination/:page/:limit').get(ProductController.getByPagination);
router.route('/products/search/:term/:page/:limit').get(ProductController.search);
router.route('/products/searchFilter/:term/:page/:limit').get(ProductController.searchFilter);
router.route('/products/searchFilter/:term/:page/:limit').post(ProductController.searchFilter);
router.route('/products/category/:slug').get(ProductController.getByCategory);
router.route('/products/ids/:ids').get(ProductController.getByIds);


router.route('/product/:id').get(ProductController.getOne);
router.route('/product/create').post(ProductController.create);
router.route('/product/update/:id').post(ProductController.update);
router.route('/product/delete/:id').delete(ProductController.remove);

router.route('/product/slug/:slug').get(ProductController.getBySlug);
router.route('/product/published').get(ProductController.getPublished);
router.route('/product/related/:id').get(ProductController.getRelated);

export default router;
