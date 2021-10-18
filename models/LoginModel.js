var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LoginModel = new Schema({
  name: String,
  profile_pic: {
    type: String,
    default:
      "https://res.cloudinary.com/ddwroqk9k/image/upload/v1634425029/i4yzf6fgiqhjhwgjea9m.png",
  },
  user_type: String,
  email: String,
  phone: String,
  password: String,
  gender: String,
  date_of_birth: Date,
  github: String,
  linkedin: String,
  father_name: String,
  address: String,
  dept: String,
  session: String,
});

module.exports = mongoose.model("Login", LoginModel);
