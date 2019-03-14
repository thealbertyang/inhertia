import express from 'express'
import * as InstagramController from '../controllers/instagram.controller'

var router = express.Router();

router.route('/instagram').get(InstagramController.getAll)
router.route('/instagram/authorize_user').get(InstagramController.authorize_user)

export default router;


