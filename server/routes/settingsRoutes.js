import express from 'express'
import * as SettingsController from '../controllers/settings.controller';

var router = express.Router();

// Get all models
router.route('/setting').get(SettingsController.getOne)
router.route('/setting/update').post(SettingsController.update)
router.route('/setting/integrations/update').post(SettingsController.integrationsUpdate)

router.route('/settings').get(SettingsController.getOne)

router.route('/settings/backup').get(SettingsController.databaseBackup);
router.route('/settings/restore/:file').get(SettingsController.databaseRestore);
router.route('/settings/reset').get(SettingsController.databaseReset);


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
