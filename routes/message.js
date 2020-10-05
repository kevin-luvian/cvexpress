const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const Message = require('../models/Message');

/* POST message */
router.post('/', tokenAuth, (req, res) => {
  const obj_info = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    body: req.body.body
  };
  new Message(obj_info)
    .save()
    .then(() => {
      res.json({ message: 'message has been saved.' });
    })
    .catch((err) => {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "saving message failed";
      return res.status(400).json({ error: errMessage });
    })
});

/* GET messages */
router.get('/', (req, res) => {
  Message.find({}, (err, obj_arr) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "retireving message failed";
      return res.status(400).json({ error: errMessage });
    }
    res.json(obj_arr);
  });
});

/* PUT message by id */
router.put('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  const obj_info = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    body: req.body.body
  };
  Message.findOneAndUpdate({ _id: id_param }, obj_info, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error updating message";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'message has been updated.' });
  });
});

/* DELETE message by id */
router.delete('/:id', tokenAuth, (req, res) => {
  const id_param = req.params.id;
  Message.deleteOne({ _id: id_param }, (err) => {
    if (err) {
      const errMessage = process.env.NODE_ENV == "development" ?
        err : "error deleting message";
      return res.status(400).json({ error: errMessage });
    }
    res.json({ message: 'message has been deleted.' });
  });
});

module.exports = router;
