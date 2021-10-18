var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContactModel = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("contact_message", ContactModel);
