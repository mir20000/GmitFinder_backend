var mongoose= require('mongoose')

var Schema = mongoose.Schema;

var AcademicModel = new Schema({
    user_id:String,
    degree: String,
    org_name:String,
    start_date:Date,
    end_date:Date,
    marks:String,
    flag:Boolean
})

 module.exports= mongoose.model('Academic',AcademicModel);