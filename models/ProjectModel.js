var mongoose= require('mongoose')

var Schema = mongoose.Schema;

var ProjectModel = new Schema({
    user_id:String,
    topic: String,
    note:String,
    start_date:Date,
    end_date:Date,
    project_link:String,
    git_link:String,
    flag:Boolean
})

 module.exports= mongoose.model('Project',ProjectModel);