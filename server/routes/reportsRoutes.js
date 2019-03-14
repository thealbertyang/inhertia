import express from 'express'
import * as ReportsController from '../controllers/reports.controller';

var router = express.Router();

// Get all models
router.route('/reports').get(ReportsController.getOne);

// Get all models
router.route('/reports/getTrendingProducts').get(ReportsController.getTrendingProducts);
router.route('/reports/getProfitByMonth').get(ReportsController.getProfitByMonth);
router.route('/reports/getOrdersPerMonth').get(ReportsController.getOrdersPerMonth);

router.route('/reports/getCustomersGeo').get(ReportsController.getCustomersGeo);

//Get one model by id
//router.route('/reports/:id').get(ReportsController.getOne);

//Add a new model
router.route('/reports/create').post(ReportsController.create);

// Edit an existing Model
router.route('/reports/update').post(ReportsController.update);

// Edit an existing Model
//router.route('/reports/update/:id').post(ReportsController.update);

// Delete a Model by id
router.route('/reports/delete').delete(ReportsController.remove);

export default router;
