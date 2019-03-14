import express from 'express'
import * as BoardController from '../controllers/board.controller';

var router = express.Router();

// Get all models
router.route('/board').get(BoardController.getOne)
router.route('/board/update').post(BoardController.update)
 
//Get one model by id
//router.route('/settings/:id').get(SettingsController.getOne);
/*
//Add a new model
router.route('/settings/create').post(SettingsController.create);

// Edit an existing Model
router.route('/settings/update').post(SettingsController.update);

// Edit an existing Model
router.route('/settings/integrations/update').post(SettingsController.integrationsUpdate);

// Edit an existing Model

// Edit an existing Model
router.route('/settings/restore/:file').get(SettingsController.databaseRestore);

// Delete a Model by id
router.route('/settings/delete').delete(SettingsController.remove);*/

export default router;
