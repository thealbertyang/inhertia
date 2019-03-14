var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
  name: String,
	description: String,
	tax_rate: String,
	shipping_rate: String,
	integrations_stripe: String,
	integrations_instagram: String,
	integrations_lightinthebox_username: String,
	integrations_lightinthebox_password: String,
	warnings_delete: {
	  type: Boolean,
	  default: false,
	}
})

SettingsSchema.virtual('settings').get(()=>'true')
var Settings = mongoose.model('Settings', SettingsSchema);
module.exports = Settings;
