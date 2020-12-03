const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const QuickInfo = require('../models/QuickInfo');

/* POST quickinfo */
router.post('/', tokenAuth, (req, res, next) => {
  const obj_info = {
    type: req.body.type,
    icon: req.body.icon,
    title: req.body.title,
    description: req.body.description
  };
  new QuickInfo(obj_info)
    .save()
    .then(() => {
      res.json({ message: 'quickinfo has been saved.' });
    })
    .catch((err) => {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "saving quickinfo failed";
      return res.status(400).json({ error: errMessage });
    })
});

/* GET quickinfos */
router.get('/', (req, res) => {
  QuickInfo.find({}, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving quickinfo failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* GET quickinfos by type */
router.get('/:type', (req, res) => {
  const type_param = req.params.type;
  QuickInfo.find({ type: type_param }, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving quickinfo failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* PUT quickinfos by id */
router.put('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  const obj_info = {
    type: req.body.type,
    icon: req.body.icon,
    title: req.body.title,
    description: req.body.description
  };
  QuickInfo.findOneAndUpdate({ _id: id_param }, obj_info, (err) => {
    if (err) {
      console.log("[ error ]", err)
      return res.status(400).json({ error: "error updating myinfo" });
    }
    res.json({ message: 'myinfo has been updated.' });
  });
});

/* DELETE quickinfo by id */
router.delete('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  QuickInfo.deleteOne({ _id: id_param }, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error deleting quickinfo";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'quickinfo has been deleted.' });
  });
});

module.exports = router;
