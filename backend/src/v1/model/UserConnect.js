const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserConnect = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    },
    receiver: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    },
    nodeId: {
        type: String,
        default: null,
    },
    status: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('UserConnect', UserConnect);
