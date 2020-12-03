const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Skill = require('../models/Skill');

/* POST skill */
router.post('/', tokenAuth, (req, res) => {
  const obj_info = {
    title: req.body.title,
    category: req.body.category,
    percentage: req.body.percentage
  };
  new Skill(obj_info)
    .save()
    .then(() => {
      res.json({ message: 'skill has been saved.' });
    })
    .catch((err) => {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "saving skill failed";
      return res.status(400).json({ error: errMessage });
    })
});

/* GET skills */
router.get('/', (req, res) => {
  Skill.find().lean().exec((err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving skill failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* GET skills grouped */
router.get('/group', (req, res) => {
  Skill.find().lean().exec((err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving skill failed";
      return res.status(400).json({ error: errMessage });
    }
    const skills_index = {};
    const skills_formatted = [];
    obj_arr.forEach(obj => {
      if (obj.category in skills_index) {
        skills_formatted[skills_index[obj.category]].elements.push(obj);
      } else {
        skills_index[obj.category] = skills_formatted.length;
        skills_formatted.push({ category: obj.category, elements: [obj] });
      }
    });
    res.json(skills_formatted);
  });
});

/* PUT skill by id */
router.put('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  const obj_info = {
    title: req.body.title,
    category: req.body.category,
    percentage: req.body.percentage
  };
  Skill.updateOne({ _id: id_param }, obj_info, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error updating skill";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'skill has been updated.' });
  });
});

/* DELETE skill by id */
router.delete('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  Skill.deleteOne({ _id: id_param }, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error deleting skill";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'skill has been deleted.' });
  });
});

module.exports = router;
