const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Directory = require('../models/Directory');
const DirectoryService = require('../services/directoryService');

/* POST directory */
router.post('/', tokenAuth, (req, res, next) => {
  const obj_info = {
    displays: req.body.displays,
    title: req.body.title,
    description: req.body.description,
    order: req.body.order,
    show: req.body.show,
    main: req.body.main,
    sections: req.body.sections,
  };
  new Directory(obj_info)
    .save()
    .then(() => {
      res.json({ message: 'directory has been saved.' });
    })
    .catch((err) => {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "saving education failed";
      return res.status(400).json({ error: errMessage });
    })
});

/* GET directories */
router.get('/', (req, res) => {
  Directory.find({ main: true, show: true }, (err, obj_arr) => {
    const obj_parsed = []
    obj_arr.forEach(obj => {
      obj_parsed.push(obj.toObject())
    });
    res.json(obj_parsed);
  });
});

/* GET unblocked directories */
router.get('/unblocked', tokenAuth, (req, res) => {
  Directory.find({}, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving directory failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* PUT directory by id */
router.put('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  const obj_info = {
    displays: req.body.displays,
    title: req.body.title,
    description: req.body.description,
    order: req.body.order,
    show: req.body.show,
    main: req.body.main,
    sections: req.body.sections,
  };
  Directory.updateOne({ _id: id_param }, obj_info, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error updating directory";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'directory has been updated.' });
  });
});

/* DELETE directory by id */
router.delete('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  Directory.findOne({ _id: id_param }, (err, directory_main) => {
    if (err | directory_main == null) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error deleting directory";
      return res.status(400).json({ error: errMessage });
    }
    Directory.find().lean().exec((err, all_directory) => {
      if (err) {
        const errMessage = process.env.NODE_ENV == "development" ?
          err : "error finding directory";
        return res.status(400).json({ error: errMessage });
      }
      DirectoryService.deleteDirectories(directory_main, all_directory);
    });
  });
});

module.exports = router;
