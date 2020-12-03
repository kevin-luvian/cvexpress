const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Description = require('../models/Description');

/* POST description. */
router.post('/', tokenAuth, (req, res, next) => {
  const obj_info = {
    quickDescription: req.body.quickDescription,
    professions: req.body.professions,
    imageID: req.body.imageID,
    cvID: req.body.cvID
  };
  Description.find({}, (err, obj_arr) => {
    if (err) {
      console.log("[ error ]", err)
      return res.status(400).json({ error: "error finding description" });
    } else if (obj_arr.length === 0) {
      new Description(obj_info)
        .save()
        .then(() => {
          res.json({ message: 'description has been saved.' });
        })
        .catch((err) => {
          const errMessage = process.env.NODE_ENV == "development" ?
            err : "saving description failed";
          return res.status(400).json({ error: errMessage });
        })
    } else {
      Description.findOneAndUpdate({ _id: obj_arr[0]._id }, obj_info, (err) => {
        if (err) {
          console.log("[ error ]", err)
          return res.status(400).json({ error: "error updating description" });
        }
        res.json({ message: 'description has been updated.' });
      });
    }
  });
});

/* GET description */
router.get('/', (req, res, next) => {
  try {
    Description.find({}, (err, obj_arr) => {
      if (err | obj_arr.length === 0) {
        return res.status(400).json({ error: "description doesnt exist" });
      } else if (obj_arr.length > 1) {
        for (let i = 1; i < obj_arr.length; i++) {
          Description.deleteOne({ _id: obj_arr[i]._id });
        }
      }
      res.json(obj_arr[0]);
    });
  } catch (err) {
    console.log("[ error ]", err)
  }
});

module.exports = router;
