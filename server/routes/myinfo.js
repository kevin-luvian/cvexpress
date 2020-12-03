const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const MyInfo = require('../models/MyInfo');

/* POST myinfo. */
router.post('/', tokenAuth, (req, res, next) => {
  const myinfo = {
    fullname: req.body.fullname,
    email: req.body.email,
    address: req.body.address
  };

  MyInfo.find({}, (err, obj_arr) => {
    if (err) {
      console.log("[ error ]", err)
      return res.status(400).json({ error: "error finding myinfo" });
    }
    else if (obj_arr.length === 0) {
      new MyInfo(myinfo)
        .save()
        .then(() => {
          res.json({ message: 'myinfo has been saved.' });
        })
        .catch((err) => {
          const errMessage = process.env.NODE_ENV == "development" ?
            "[ error ] " + err : "saving myinfo failed";
          return res.status(400).json({ error: errMessage });
        })
    }
    else {
      MyInfo.findOneAndUpdate({ _id: obj_arr[0]._id }, myinfo, (err) => {
        if (err) {
          console.log("[ error ]", err)
          return res.status(400).json({ error: "error updating myinfo" });
        }
        res.json({ message: 'myinfo has been updated.' });
      });
    }
  });
});

/* GET myinfo */
router.get('/', (req, res, next) => {
  try {
    MyInfo.find({}, (err, obj_arr) => {
      if (err | obj_arr.length === 0) {
        return res.status(400).json({ error: "myinfo doesnt exist" });
      }
      else if (obj_arr.length > 1) {
        for (let i = 1; i < obj_arr.length; i++) {
          MyInfo.deleteOne({ _id: obj_arr[i]._id });
        }
      }
      res.json(obj_arr[0]);
    });
  } catch (err) {
    console.log("[ error ]", err)
  }
});

module.exports = router;
