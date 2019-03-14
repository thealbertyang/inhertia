import express from 'express'
import * as GuestController from '../controllers/guest.controller';

var router = express.Router();

// Get all Model
router.route('/guests').get(GuestController.getAll);

router.route('/guests/pagination/:page/:limit').get(GuestController.getByPagination);
router.route('/guests/search/:term/:page/:limit').get(GuestController.search);


router.route('/guest/:id').get(GuestController.getOne);
//router.route('/guest/create').post(GuestController.create);
//router.route('/guest/update/:id').post(GuestController.update);
router.route('/guest/delete/:id').delete(GuestController.remove);

router.route('/guest/user/:id').get(GuestController.getByUserId);

//router.route('/guest/login').post(GuestController.login);
//router.route('/guest/register').post(GuestController.register);

export default router;


