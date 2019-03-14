import express from 'express'
import * as TicketController from '../controllers/ticket.controller';

var router = express.Router();

router.route('/tickets').get(TicketController.getAll);

router.route('/tickets/pagination/:page/:limit').get(TicketController.getByPagination);
router.route('/tickets/search/:term/:page/:limit').get(TicketController.search);
router.route('/tickets/update').post(TicketController.updateAll);

router.route('/tickets/user/:id').get(TicketController.getByUser);

router.route('/ticket/:id').get(TicketController.getOne)


router.route('/ticket/create').post(TicketController.create);
router.route('/ticket/update/:id').post(TicketController.update);
router.route('/ticket/delete/:id').delete(TicketController.remove);

router.route('/ticket/update/:id/messages').post(TicketController.updateMessages)


export default router;


