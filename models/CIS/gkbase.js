var mongoose = require('../../libs/mongoose');
var Calendar = require('./calendar');
var Schema = mongoose.Schema;

// create the model for users and expose it to our app
var Apps = new Schema({

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
    type: String
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
  },
  year: {
    type: Number
  }
});

Apps.statics.removeAllByYear = function(year) {
  var self = this;
  self.find({year: year})
  .exec(function(err, data) {
    if(err) throw err;
    data.forEach(function(v, i) {
      Calendar.findOneAndRemove({appId: v._id})
      .exec(function(err) {
        if (err) throw err;
      })
      self.findByIdAndRemove(v._id, function(err) {
        if (err) throw err;
      });
    });
  });
}

module.exports = mongoose.model('Apps', Apps);
