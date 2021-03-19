var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RestaurantSchema = new Schema({
	restaurant_name: {type: String, required: true, max: 255},
	restaurant_addr: {type: String, required: false, max: 255},
	qr_code: {type: String, required: false, max:1000},
	created_by: ObjectId,
	create_date: { type : Date, required: true, default: Date.now },
	modify_date: { type : Date, required: false },
	status: { type: String, required: false, default: 'OPEN', enum: ['OPEN', 'CLOSE', 'DELETED'] }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);