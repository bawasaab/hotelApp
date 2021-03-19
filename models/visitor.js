var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var VisitorSchema = new Schema({
	restaurant_id: ObjectId,
	contact: {type: String, required: true, max: 255, unique: false},
	name: {type: String, required: true, max: 255},
	table_number: {type: Number, required: false},
	create_date: { type : Date, required: true, default: Date.now },
	modify_date: { type : Date, required: false },
	status: { type: String, required: false, default: 'OPEN', enum: ['OPEN', 'CLOSE', 'DELETED'] }
});

module.exports = mongoose.model('Visitor', VisitorSchema);