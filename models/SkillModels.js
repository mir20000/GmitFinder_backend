var mongoose= require('mongoose')

var Schema = mongoose.Schema;

var SkillModel = new Schema({
    user_id:String,
    skill: String,
    date:Date,
    flag:Boolean
})

 module.exports= mongoose.model('Skill',SkillModel);