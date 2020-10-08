const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Resume = require('../models/Resume');

/* POST resume */
router.post('/', tokenAuth, (req, res, next) => {
  const obj_info = {
    title: req.body.title,
    type: req.body.type,
    period: req.body.period,
    snippet: req.body.snippet,
    description: req.body.description
  };
  new Resume(obj_info)
    .save()
    .then(() => {
      res.json({ message: 'resume has been saved.' });
    })
    .catch((err) => {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "saving resume failed";
      return res.status(400).json({ error: errMessage });
    })
});

/* GET resumes */
router.get('/', (req, res) => {
  Resume.find({}, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving resume failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* GET resumes by type */
router.get('/:type', (req, res) => {
  const type_param = req.params.type;
  Resume.find({ type: type_param }, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving resume failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* PUT resume by id */
router.put('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  const obj_info = {
    title: req.body.title,
    type: req.body.type,
    period: req.body.period,
    snippet: req.body.snippet,
    description: req.body.description
  };
  Resume.findOneAndUpdate({ _id: id_param }, obj_info, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error updating resume";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'resume has been updated.' });
  });
});

/* DELETE resume by id */
router.delete('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  Resume.deleteOne({ _id: id_param }, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error deleting resume";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'resume has been deleted.' });
  });
});

module.exports = router;
