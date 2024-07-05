const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    organizationname: String,
    organizationremark: String,
}, {
    timestamps: true,
    versionKey: false,
})

const OrganizationModel = mongoose.model('Organization', organizationSchema);
module.exports = OrganizationModel;