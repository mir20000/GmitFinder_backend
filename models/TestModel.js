var mongoose= require('mongoose')

var Schema = mongoose.Schema;

var TestModel = new Schema({
    name: String,
    email:String,
    phone:String,
    password:String
})

 module.exports= mongoose.model('Test',TestModel);