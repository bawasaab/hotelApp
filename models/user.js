var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type: String, required: true, max: 255, unique: true},
	password: {type: String, required: true, max: 1000},
	first_name: {type: String, required: true, max: 255},
	last_name: {type: String, required: false, max: 255},
	profile_pic: {type: String, required: false, max:1000},
	create_date: { type : Date, required: true, default: Date.now },
	modify_date: { type : Date, required: false },
	
	// payment: { type: String, required: true, max: 255, enum: ['COMPLETE', 'HOLD'] },
	// status: { type: String, required: false, default: 'OPEN', enum: ['OPEN', 'CLOSE', 'DELETED'] }

	payment: { type: String, required: true, max: 255, default: 'HOLD' },
	status: { type: String, required: false, max: 255, default: 'OPEN' }
});

module.exports = mongoose.model('User', UserSchema);