var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HRWishlistModel = new Schema({
  hr_id: String,
  student_id: String,
});

module.exports = mongoose.model("hr_wishlist", HRWishlistModel);
