var myApp = require("express");
var mysql = require("mysql");
var app = myApp();
var myModel = require("./models/TestModel");
var AcademicModel = require("./models/AcademicModel");
var AchievementModel = require("./models/AchievementModel");
var ProjectModel = require("./models/ProjectModel");
var SkillModel = require("./models/SkillModels");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var myBodyParser = bodyParser.json();
var jwt = require("jsonwebtoken");
var myCrypto = require("crypto");
var key = "MIR_amar_name";
var algo = "aes256";
var cors = require("cors");
const LoginModel = require("./models/LoginModel");
const ContactModel = require("./models/ContactModel");
const HRWishlistModel = require("./models/HRWishlistModel");

const dbsql = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "",
  database: "gmit_react",
});

app.use(cors());

const mongoDB =
  "mongodb+srv://mir:mir12345@cluster0.xpmh5.mongodb.net/gmitfinder";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("GMITFINDER API");
});

/////inser all login data

//search with any keyword(using reguler expretion)
app.post("/search", myBodyParser, (req, res) => {
  var myregex = new RegExp(req.body.name, "i");
  SkillModel.find({ skill: myregex, flag: 1 }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/unique_dept", myBodyParser, (req, res) => {
  LoginModel.distinct("dept").then((details) => {
    res.status(200).json(details);
  });
});

app.post("/unique_session", myBodyParser, (req, res) => {
  LoginModel.distinct("session").then((details) => {
    res.status(200).json(details);
  });
});

app.post("/profiledata", myBodyParser, (req, res) => {
  const id = req.body.id;
  LoginModel.find({ _id: id })
    .select({
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      dept: 1,
      session: 1,
      profile_pic: 1,
    })
    .then((details) => {
      res.send(details);
    });
});

app.post("/allcvdata", myBodyParser, (req, res) => {
  const id = req.body.id;
  LoginModel.find({ _id: id }).then((details) => {
    res.send(details);
  });
});

app.post("/getcvdata", myBodyParser, (req, res) => {
  const id = req.body.id;
  LoginModel.find({ _id: id }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/login", myBodyParser, (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  var deCipher = myCrypto.createDecipher(algo, key);

  LoginModel.find({ email: email }).then((result) => {
    if (result.length > 0) {
      var decryPassword =
        deCipher.update(result[0].password, "hex", "utf8") +
        deCipher.final("utf8");
      if (decryPassword === password) {
        const { _id, name, user_type } = result[0];
        var user = {
          id: _id,
          username: name,
          user_type: user_type,
        };

        const tokenCode = jwt.sign(user, "secretKey");
        res.send({ access: tokenCode });

        // res.send(result);
      } else {
        res.send({ message: "Password is not matching" });
      }
    } else {
      res.send({ message: "Email not exist" });
    }
  });
});

app.post("/myprofiledata", myBodyParser, (req, res) => {
  const id = req.body.id;

  LoginModel.find({ _id: id }).then((details) => {
    res.send(details);
  });
});

app.post("/getnamedata", myBodyParser, (req, res) => {
  const id = req.body.id;

  LoginModel.find({ _id: id })
    .select({ name: 1 })
    .then((details) => {
      res.send(details);
    });
});

app.post("/signup", myBodyParser, (req, res) => {
  const name = req.body.name;
  const user_type = req.body.user_type;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const gender = req.body.gender;
  const dob = req.body.dob;

  var myCipher = myCrypto.createCipher(algo, key);
  var encPassword =
    myCipher.update(password, "utf8", "hex") + myCipher.final("hex");

  LoginModel.find({ email: email }).then((result) => {
    if (result.length !== 0) {
      res.send({ message: "Email Already Exist" });
    } else {
      if (password === confirm_password) {
        LoginModel.insertMany({
          name: name,
          user_type: user_type,
          email: email,
          phone: phone,
          password: encPassword,
          gender: gender,
          date_of_birth: dob,
        }).then((details) => {
          res.send(details);
        });
      } else {
        res.send({ message: "Please Enter Same in Both Password Field" });
      }
    }
  });
});

app.post("/change_password", myBodyParser, (req, res) => {
  const old_password = req.body.old_password;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const id = req.body.id;
  var deCipher = myCrypto.createDecipher(algo, key);

  LoginModel.find({ _id: id }).then((result) => {
    if (result.length > 0) {
      var decryPassword =
        deCipher.update(result[0].password, "hex", "utf8") +
        deCipher.final("utf8");
      if (decryPassword === old_password) {
        if (password === confirm_password) {
          var myCipher = myCrypto.createCipher(algo, key);
          var encPassword =
            myCipher.update(password, "utf8", "hex") + myCipher.final("hex");

          LoginModel.updateOne(
            { _id: id },
            { $set: { password: encPassword } }
          ).then((data) => {
            res.send({ message: "password_changed", details: data });
          });
        } else {
          res.send({ message: "Please Enter Same in Both Password Field" });
        }

        // res.send(result);
      } else {
        res.send({ message: "Password is not matching" });
      }
    } else {
      res.send({ message: "id not found" });
    }
  });
});

app.post("/getallskill", myBodyParser, (req, res) => {
  SkillModel.find().then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getallacademic", myBodyParser, (req, res) => {
  AcademicModel.find().then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getallachievement", myBodyParser, (req, res) => {
  AchievementModel.find().then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getallproject", myBodyParser, (req, res) => {
  ProjectModel.find().then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getflagskill", myBodyParser, (req, res) => {
  SkillModel.find({ flag: req.body.flag }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getflagacademic", myBodyParser, (req, res) => {
  AcademicModel.find({ flag: req.body.flag }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getflagachievement", myBodyParser, (req, res) => {
  AchievementModel.find({ flag: req.body.flag }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getflagproject", myBodyParser, (req, res) => {
  ProjectModel.find({ flag: req.body.flag }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/setflagskill", myBodyParser, (req, res) => {
  const id = req.body.id;
  const flag = req.body.flag;
  SkillModel.updateOne({ _id: id }, { $set: { flag: flag } }).then(
    (details) => {
      res.status(200).json(details);
    }
  );
});

app.post("/setflagacademic", myBodyParser, (req, res) => {
  const id = req.body.id;
  const flag = req.body.flag;
  AcademicModel.updateOne({ _id: id }, { $set: { flag: flag } }).then(
    (details) => {
      res.status(200).json(details);
    }
  );
});

app.post("/setflagachievement", myBodyParser, (req, res) => {
  const id = req.body.id;
  const flag = req.body.flag;
  AchievementModel.updateOne({ _id: id }, { $set: { flag: flag } }).then(
    (details) => {
      res.status(200).json(details);
    }
  );
});

app.post("/setflagproject", myBodyParser, (req, res) => {
  const id = req.body.id;
  const flag = req.body.flag;
  ProjectModel.updateOne({ _id: id }, { $set: { flag: flag } }).then(
    (details) => {
      res.status(200).json(details);
    }
  );
});

app.post("/getskill", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  SkillModel.find({ user_id: user_id, flag: true }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getacademic", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  AcademicModel.find({ user_id: user_id, flag: true }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getachievement", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  AchievementModel.find({ user_id: user_id, flag: true }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/getproject", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  ProjectModel.find({ user_id: user_id, flag: true }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/insertyourinfo", myBodyParser, (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const dob = req.body.dob;
  const gender = req.body.gender;
  const father_name = req.body.father_name;
  const address = req.body.address;
  const github = req.body.github;
  const linkedin = req.body.linkedin;
  const session = req.body.session;
  const dept = req.body.dept;

  LoginModel.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        phone: phone,
        email: email,
        gender: gender,
        date_of_birth: dob,
        github: github,
        linkedin: linkedin,
        father_name: father_name,
        address: address,
        dept: dept,
        session: session,
      },
    }
  ).then((details) => {
    res.status(200).json(details);
  });

  // dbsql.query(
  //   "UPDATE login_cred SET name=?,phone=? ,email=? ,gender=? ,date_of_birth=? ,github=? ,linkedin=? ,father_name=? ,address=? wHERE id=?",
  //   [
  //     name,
  //     phone,
  //     email,
  //     gender,
  //     dob,
  //     github,
  //     linkedin,
  //     father_name,
  //     address,
  //     id,
  //   ],
  //   (err, result) => {
  //     if (err) {
  //       res.status(200).json(err);
  //     }
  //     res.status(200).json("changed");
  //   }
  // );
});

app.post("/insertskill", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  const skill = req.body.skill;
  const date = req.body.date;

  SkillModel.insertMany({
    user_id: user_id,
    skill: skill,
    date: date,
  }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/insertacademic", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  const degree = req.body.degree;
  const org_name = req.body.org_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const marks = req.body.marks;

  AcademicModel.insertMany({
    user_id: user_id,
    degree: degree,
    org_name: org_name,
    start_date: start_date,
    end_date: end_date,
    marks: marks,
  }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/insertachievement", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  const topic = req.body.topic;
  const org_name = req.body.org_name;
  const date = req.body.date;
  const note = req.body.note;

  AchievementModel.insertMany({
    user_id: user_id,
    topic: topic,
    org_name: org_name,
    date: date,
    note: note,
  }).then((details) => {
    res.status(200).json(details);
  });
});

app.post("/insertproject", myBodyParser, (req, res) => {
  const user_id = req.body.user_id;
  const topic = req.body.topic;
  const note = req.body.note;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const project_link = req.body.project_link;
  const git_link = req.body.git_link;

  ProjectModel.insertMany({
    user_id: user_id,
    topic: topic,
    note: note,
    start_date: start_date,
    end_date: end_date,
    project_link: project_link,
    git_link: git_link,
  }).then((details) => {
    res.status(200).json(details);
  });
});

//ecrypte and update all password
app.get("/encryupdate/:id", (req, res) => {
  myModel.find({ _id: req.params.id }).then((data) => {
    var myCipher = myCrypto.createCipher(algo, key);
    var myEnPass =
      myCipher.update(data[0].password, "utf8", "hex") + myCipher.final("hex");

    myModel
      .updateOne(
        { _id: req.params.id },
        {
          $set: {
            password: myEnPass,
          },
        }
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => console.log(err));
  });
});

app.post("/passworddecry", myBodyParser, (req, res) => {
  myModel.findOne({ email: req.body.email }).then((data) => {
    var deCipher = myCrypto.createDecipher(algo, key);
    var decryPass =
      deCipher.update(data.password, "hex", "utf8") + deCipher.final("utf8");
    res.json(decryPass);
  });
});

app.post("/update_profile_pic", myBodyParser, (req, res) => {
  LoginModel.updateOne(
    { _id: req.body.id },
    {
      $set: {
        profile_pic: req.body.profile_pic,
      },
    }
  )
    .then((result) => {
      res.status(200).json({ message: "update" });
    })
    .catch((err) => console.log(err));
});

app.post("/insertcontact", myBodyParser, (req, res) => {
  ContactModel.insertMany({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  }).then((data) => {
    res.send({ message: "inserted", info: data });
  });
});

app.post("/get_contact", myBodyParser, (req, res) => {
  ContactModel.find().then((result) => {
    res.send(result.reverse());
  });
});

app.post("/hr_wishlist_add", myBodyParser, (req, res) => {
  HRWishlistModel.insertMany({
    hr_id: req.body.hr_id,
    student_id: req.body.student_id,
  }).then((result) => {
    res.send({ message: "inserted" });
  });
});

app.post("/hr_wishlist_remove", myBodyParser, (req, res) => {
  HRWishlistModel.remove({
    hr_id: req.body.hr_id,
    student_id: req.body.student_id,
  }).then((result) => {
    res.send({ message: "removed" });
  });
});
app.post("/hr_wishlist_data", myBodyParser, (req, res) => {
  HRWishlistModel.find({
    hr_id: req.body.hr_id,
  }).then((result) => {
    res.send(result);
  });
});

app.post("/hr_wishlist_exist", myBodyParser, (req, res) => {
  HRWishlistModel.find({
    hr_id: req.body.hr_id,
    student_id: req.body.student_id,
  }).then((result) => {
    if (result.length > 0) {
      res.send({ exist: true });
    } else {
      res.send({ exist: false });
    }
  });
});

app.listen(process.env.PORT || 4555, () => {
  console.log("Server Is Active On 4555 Port");
});

// app.post("/login",myBodyParser,(req,res)=>{
//     const password = req.body.password;
//     const email = req.body.email;

//     myModel.findOne({email:email}).then((loginData)=>{
//         if (loginData) {
//             if(loginData.password===password){

//                 const {_id,name}=loginData
//                 var user = {id:_id,
//                             username: name,
//                             }

//                 const tokenCode = jwt.sign(user,"secretKey");
//                 res.send({access: tokenCode})

//                 // res.status(200).json(user)
//             }
//             else{
//                 res.status(200).json({message:'Wraong password'})
//             }
//         }else{
//             res.status(200).json({message:'Wraong email'})
//         }
//     })

//     // const {id,name,password,email,phone,user_id}=result[0]
//     // var user = {id:id,
//     //             username: name,
//     //             email:email,
//     //             password:password,
//     //             phone:phone,
//     //             user_id:user_id,
//     //             user_type:"user"}

//     // const tokenCode = jwt.sign(user,"secretKey");
//     // res.send({access: tokenCode})

//     });
