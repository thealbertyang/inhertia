import express from 'express'
import * as ProductCategoryController from '../controllers/productCategory.controller';
import { Stripe } from 'stripe'

var router = express.Router();

router.route('/productCategories').get(ProductCategoryController.getAll);
router.route('/productCategories/pagination/:page/:limit').get(ProductCategoryController.getByPagination);
router.route('/productCategories/search/:term/:page/:limit').get(ProductCategoryController.search);

router.route('/productCategory/:id').get(ProductCategoryController.getOne);
router.route('/productCategory/create').post(ProductCategoryController.create);
router.route('/productCategory/update/:id').post(ProductCategoryController.update);
router.route('/productCategory/delete/:id').delete(ProductCategoryController.remove);

export default router;
