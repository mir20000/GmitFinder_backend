

var myApp = require('express');
var app=myApp();
var myModel = require('./models/TestModel');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var myBodyParser = bodyParser.json()
var myCrypto = require('crypto')
var key = 'password123'
var algo ="aes256"


const mongoDB="mongodb+srv://mir:mir12345@cluster0.xpmh5.mongodb.net/test_db"
mongoose.connect(mongoDB,{useNewUrlParser:true,useUnifiedTopology:true})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//show all item
app.get('/data',(req,res)=>{
    myModel.find({},{password:0}).then((details)=>{
        res.status(200).json(details)
    })
})

// delete any document
app.delete('/del:_id',(req,res)=>{
    myModel.deleteOne({_id:req.params._id}).then((details)=>{
        res.status(200).json(details)
    }).catch(err=>console.log(err))
})

//insert item into doucument

app.post('/insert',myBodyParser,(req,res)=>{
    const data = new myModel({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password
    })
    data.save().then((details)=>{
        res.status(200).json(details)
    }).catch(err=>console.log(err))
})

//update the value of a document

app.put("/update",myBodyParser,(req,res)=>{
    myModel.updateOne(
        {_id:req.body.id},
        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                // password:req.body.password
            }
        }
    ).then((result)=>{
        res.status(200).json(result)
    }).catch(err=>console.log(err))
})

//seach data from the document
app.get("/search/:name",(req,res)=>{
    myModel.find({name:req.params.name}).then((details)=>{
        res.status(200).json(details)
    })
})

//search with any keyword(using reguler expretion)
app.get('/searchany/:name',(req,res)=>{
    var myregex = new RegExp(req.params.name,'i');
    myModel.find({name:myregex}).then((details)=>{
        res.status(200).json(details)
    })
})

//ecrypte and update all password
app.get('/encryupdate/:id',(req,res)=>{
    
    

    myModel.find({_id:req.params.id}).then((data)=>{
        var myCipher= myCrypto.createCipher(algo,key)
        var myEnPass = myCipher.update(data[0].password,'utf8','hex')
        +myCipher.final('hex');

        myModel.updateOne(

            {_id:req.params.id},
            {
                $set:{
                    password: myEnPass
                }
            }
        ).then((result)=>{
            res.status(200).json(result)
        }).catch(err=>console.log(err))
    })


})


app.post('/passworddecry',myBodyParser,(req,res)=>{
    myModel.findOne({email:req.body.email}).then((data)=>{
        var deCipher = myCrypto.createDecipher(algo,key);
        var decryPass = deCipher.update(data.password,'hex','utf8')
        +deCipher.final('utf8');
        res.json(decryPass)
    })
})


app.listen(4555)