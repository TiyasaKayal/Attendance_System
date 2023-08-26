const multer = require('multer');
const bodyParser = require('body-parser');
const express= require('express');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/labeled_images')
    },
    filename: function (req, file, cb) {
      
      cb(null, req.body.rollno + "." + file.originalname.substring(file.originalname.indexOf('.')+1) )
    }
  })
const upload = multer({storage: storage})

const Controller = require("../controllers/controller");
const { append } = require('express/lib/response');

router.get('/',Controller.getIndex);
router.get('/datewise',Controller.getDatewise);
router.post('/getallbydate',Controller.postAllbydate);
router.get('/student/:rollno',Controller.getStudprofile);
router.get('/register',Controller.getRegister);
router.get('/view_all',Controller.viewAll);
router.post('/register',upload.single("image"),Controller.postRegister);
router.get('/recorded/:rno',Controller.getRecorded);
router.get('/live_attendance',Controller.getLiveAttendance);

module.exports = router;