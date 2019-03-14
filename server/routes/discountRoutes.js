import express from 'express'
import * as DiscountController from '../controllers/discount.controller';

var router = express.Router();

router.route('/discounts').get(DiscountController.getAll);

router.route('/discounts/pagination/:page/:limit').get(DiscountController.getByPagination);
router.route('/discounts/search/:term/:page/:limit').get(DiscountController.search);
router.route('/discounts/decrypt/').post(DiscountController.getByCodes);


router.route('/discount/:id').get(DiscountController.getOne);
router.route('/discount/create').post(DiscountController.create);
router.route('/discount/update/:id').post(DiscountController.update);
router.route('/discount/delete/:id').delete(DiscountController.remove);

router.route('/discount/decrypt/:code').get(DiscountController.getByCode);

export default router;


