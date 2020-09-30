
const router = require('express').Router();
const grid = require('gridfs-stream');
const mongoose = require("mongoose");
const tokenAuth = require("../middleware/tokenauth");
const upload = require("../middleware/upload");


/* GET all file info. */
router.get('/', (req, res) => {
    const db = mongoose.connection.db;
    const collection = db.collection('upload.files');
    collection.find({}).toArray((err, data_list) => {
        if (err) return next({ error: "error finding file" });
        for (let i = 0; i < data_list.length; i++) {
            data_list[i].fileurl =
                `http://${req.get('host')}` +
                '/api/files' +
                `/${data_list[i]._id}/` +
                data_list[i].metadata.originalname;
        }
        return res.json({ data: data_list });
    });
});

/* POST file. */
router.post('/', tokenAuth, async (req, res) => {
    try {
        await upload(req, res);

        console.log("Req File::", req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        return res.send('File has been uploaded.');
    } catch (error) {
        console.log(`Error ${error}`);
        return res.send(`Error when trying upload image: ${error}`);
    }
})

/* GET file by ID */
router.get('/:id/:filename', (req, res) => {
    const fileID = mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;

    // find file from id
    db.collection('upload.files').findOne({ _id: fileID }, (err, data) => {
        // check for error
        if (err) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error finding file" })
        }
        if (!data || data.length === 0) return res.status(404).json({ error: "no file found" });

        const gfs = grid(db, mongoose.mongo);
        gfs.collection("upload");
        gfs.createReadStream({ _id: fileID }).pipe(res);
    })
});

module.exports = router;
