const studModel = require("../models/student");
const dateModel = require("../models/date");
const uid="628d233fd68a8645018bd717";

exports.getIndex = (req,res)=>{
    res.render('index');
};

exports.getDatewise = (req,res)=>{
    res.render('datewise');
};
exports.postAllbydate = (req,res)=>{
    var date = req.body.a_date.replace(/-/g, "/");
    const names=[]
    const rollnos=[]
    studModel.find({},function(err,docs){
        for(const doc of docs){
            if(doc.attendance.includes(date)){
                names.push(doc.name);
                rollnos.push(doc.Rollno);
            }
            
        }
        const cdate=date.split("/");
        res.render('daywiselist',{names,rollnos,cdate});
    })
};

exports.getStudprofile = (req,res)=>{
    studModel.find({Rollno: req.params.rollno},function(err,docs)  {
        dateModel.findById(uid,function(err,docs1){
           res.render('studentpage',{docs,a_perc: Math.round((docs[0].attendance.length/docs1.workingdays.length)*100)});
        })
        
        
    })
};

exports.getRegister = (req,res) => {
    studModel.find({},function(err,docs){
        const rollnos=[]
        for(const doc of docs){
            rollnos.push(doc.Rollno);
        }
        res.render('register',{rollnos});
    })
};

exports.viewAll = (req,res) => {
    const names = [];
    const Rollnos = [];
    studModel.find({},function(err,docs){
        for(const doc of docs){
            names.push(doc.name);
            Rollnos.push(doc.Rollno);
            
        }
        res.render('view_all',{names,Rollnos});
    })
};

exports.postRegister = (req,res) => {
    const fname = req.file.filename;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; 
    if(month<10){month="0"+month}
    var day = dateObj.getUTCDate();
    if(day<10){day="0"+day}
    var year = dateObj.getUTCFullYear();
    
    newdate = year + "/" + month + "/" + day;
   
       const newstud = new studModel({
           name: req.body.name,
           Rollno: req.body.rollno,
           dateofreg: newdate
       })
       newstud.save().then((result1) => {
           res.redirect('/');
       })
       .catch((err) => {
           console.log(err);
       })

}

exports.getRecorded = (req,res) => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; 
    if(month<10){month="0"+month}
    var day = dateObj.getUTCDate();
    if(day<10){day="0"+day}
    var year = dateObj.getUTCFullYear();
      newdate = year + "/" + month + "/" + day;
      dateModel.findByIdAndUpdate(uid, {$addToSet:{workingdays: newdate}},function(err,docs1){});  
      studModel.findOneAndUpdate({Rollno: req.params.rno},{$addToSet :{attendance:newdate}},function(err,docs){
            
            res.render('recorded',{name: docs.name});
     })
     
}

exports.getLiveAttendance = (req,res) => {
    const labels = [];
     
    studModel.find({}, function(err,studs){
         for(const element of studs){
             labels.push(element.Rollno);
     
             
         }
    
         res.render('livesess',{labels});
     });
}






