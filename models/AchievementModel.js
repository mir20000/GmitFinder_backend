var mongoose= require('mongoose')

var Schema = mongoose.Schema;

var AchievmentModel = new Schema({
    user_id:String,
    topic: String,
    org_name:String,
    date:Date,
    note:String,
    flag:Boolean
})

 module.exports= mongoose.model('Achievement',AchievmentModel);