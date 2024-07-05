const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parcelTypeSchema = new Schema({
    parcelTypename: String,
    parcelTyperemark: String,
}, {
    timestamps: true,
    versionKey: false,
})

const ParcelTypeModel = mongoose.model('ParcelType', parcelTypeSchema);
module.exports = ParcelTypeModel;