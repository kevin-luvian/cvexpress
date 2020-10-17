const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Directory = require('../models/Directory');
const DirectoryService = require('../services/directoryService');

/* POST directory */
router.post('/', tokenAuth, async (req, res, next) => {
  const obj_info = {
    displays: req.body.displays,
    title: req.body.title,
    description: req.body.description,
    order: req.body.order,
    show: req.body.show,
    main: req.body.main,
    sections: req.body.sections,
  };
  const result = await DirectoryService.createDirectories(obj_info);
  res.json(result);
});

/* GET unblocked directories */
router.get('/unblocked', tokenAuth, (req, res) => {
  Directory.find({ main: true }).lean().exec(async (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving directory failed";
      return res.status(400).json({ error: errMessage });
    }
    const obj_parsed = [];
    for (let i = 0; i < obj_arr.length; i++) {
      obj_arr[i].displays = await DirectoryService.changeDisplayIDsToFile(
        obj_arr[i].displays,
        `http://${req.headers.host}/api/files`
      );
      obj_parsed.push(obj_arr[i]);
    }
    res.json(obj_parsed);
  });
});

/* GET directory by ID */
router.get('/:id', async (req, res) => {
  const id_param = req.params.id;
  Directory.findById(id_param).lean().exec(async (err, directory) => {
    try {
      if (err || directory == null || directory.length == 0)
        throw (err || "null");
      if (directory.main && directory.show) {
        const base_url = `http://${req.headers.host}/api/files`;
        res.json(await DirectoryService.fetchDirectories(id_param, base_url));
      }
      else
        throw "null";
    } catch (err) {
      console.log(` [error] ${err}`);
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error getting directory";
      return res.status(400).json({ error: errMessage });
    }
  });
});

/* GET directories */
router.get('/', (req, res) => {
  Directory.find({ main: true, show: true }).lean().exec(async (err, obj_arr) => {
    if (err || obj_arr == null || obj_arr.length == 0)
      throw (err || "null");
    const obj_parsed = [];
    for (let i = 0; i < obj_arr.length; i++) {
      obj_arr[i].displays = await DirectoryService.changeDisplayIDsToFile(
        obj_arr[i].displays,
        `http://${req.headers.host}/api/files`
      );
      obj_parsed.push(obj_arr[i]);
    }
    res.json(obj_parsed);
  });
});

/* PUT directory */
router.put('/', tokenAuth, async (req, res) => {
  const obj_info = {
    _id: req.body._id,
    displays: req.body.displays,
    title: req.body.title,
    description: req.body.description,
    order: req.body.order,
    show: req.body.show,
    main: req.body.main,
    sections: req.body.sections,
  };
  DirectoryService.filterAndDeleteDirectories(obj_info);
  DirectoryService.updateDirectories(obj_info);
  res.send("directories updated");
});

/* DELETE directory by id */
router.delete('/:id', tokenAuth, async (req, res) => {
  try {
    const id_param = mongoose.Types.ObjectId(req.params.id);
    await DirectoryService.DeleteDirectoriesByID(id_param);
    console.log("Directories Deleted");
    res.send("directories deleted");
  } catch (err) {
    console.log(` [error] ${err}`);
    const errMessage = process.env.NODE_ENV == "development" ?
      err : "error getting directory";
    return res.status(400).json({ error: errMessage });
  }
});

module.exports = router;
