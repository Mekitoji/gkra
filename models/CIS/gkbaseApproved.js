var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;

// create the model for users and expose it to our app

var approvedApps = new Schema({

  country: {
    type: String
  },
  appName: {
    type: String
  },
  category: {
    type: String
  },
  sdpStatus: {
    type: String
  },
  updateTime: {
    type: Date
  },
  seller: {
    type: String
  },
  tv: {
    type: String
  },
  currentStatus: {
    type: String
  },
  testCycles: {
    type: Number,
    default: 1
  },
  replyTime: {
    type: Number
  },
  resp: {
    type: Schema.ObjectId,
    ref: 'TesterStat'
  },
  color: {
    type: String
  },
  applicationId: {
    type: String,
  },
  outdated: {
    type: Boolean,
    default: false
    // true - outdated, false in progress
  }
});

module.exports = mongoose.model('approvedApps', approvedApps);