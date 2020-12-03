const router = require('express').Router();
const grid = require('gridfs-stream');
const path = require('path');
const mongoose = require("mongoose");
const tokenAuth = require("../middleware/tokenauth");
const upload = require("../middleware/upload");
const FileMetadata = require("../models/FileMetadata")

/* GET all file info. */
router.get('/', (req, res) => {
    FileMetadata.find().lean().exec((err, obj_arr) => {
        if (err) {
            return res.status(400).json({
                error: process.env.NODE_ENV == "development" ? err : "an error occured"
            });
        }
        obj_arr.forEach(obj => {
            obj["url"] = `http://${req.headers.host}/api/files/` +
                `${obj._id}/` +
                obj.filename.replace(/\s+/g, "%20");
        });
        return res.json(obj_arr);
    });
});

/* POST file. */
router.post('/', tokenAuth, async (req, res) => {
    try {
        await upload(req, res);

        if (req.file == undefined) {
            return res.status(400).json({ error: "You must select a file" });
        }

        const filename = path.extname(req.headers.filename) == path.extname(req.file.originalname) ?
            req.headers.filename :
            req.headers.filename + path.extname(req.file.originalname);

        // Create a Metadata
        const filemetadata = new FileMetadata({
            _id: req.file.id,
            filename: filename,
            contentType: req.file.contentType,
            uploadDate: req.file.uploadDate,
            size: req.file.size,
            group: req.group
        });
        filemetadata
            .save()
            .then(() => {
                res.json({ message: 'File has been uploaded' });
            })
    } catch (err) {
        const errMessage = process.env.NODE_ENV == "development" ?
            err : "saving education failed";
        return res.status(400).json({ error: `Error when trying upload image: ${errMessage}` });
    }
})

/* PUT file by ID */
router.put('/:id', (req, res) => {
    const fileID = mongoose.Types.ObjectId(req.params.id);
    const obj_info = {
        filename: req.body.filename,
        contentType: req.body.contentType
    };
    console.log("Obj Info", obj_info)

    // find file from id
    FileMetadata.findOne({ _id: fileID }).lean().exec((err, obj) => {
        // check for error
        if (err | obj === null) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error finding file" })
        }
        const filename = path.extname(obj.filename) == path.extname(obj_info.filename) ?
            obj_info.filename :
            obj_info.filename + path.extname(obj.filename);
        // find file from id
        FileMetadata.findOneAndUpdate({ _id: fileID }, obj_info, (err) => {
            // check for error
            if (err) {
                console.log("[ error ]", err)
                return res.status(404).json({ error: "error updating file" })
            }
            res.json({ message: 'file has been updated.' });
        });
    });
});

/* GET file by ID */
router.get('/:id', (req, res) => {
    const fileID = mongoose.Types.ObjectId(req.params.id);

    // find file from id
    FileMetadata.findOne({ _id: fileID }).lean().exec((err, obj) => {
        // check for error
        if (err | obj === null) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error finding file" })
        }
        obj["url"] = `http://${req.headers.host}/api/files/` +
            `${obj._id}/` +
            obj.filename.replace(/\s+/g, "%20");
        res.json(obj);
    });
});

/* GET (Render) file by ID and Filename */
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

/* DELETE file by ID */
router.delete('/:id', (req, res) => {
    const fileID = mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;

    // find file from id
    db.collection('upload.chunks').deleteOne({ _id: fileID }, (err) => {
        // check for error
        if (err) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error deleting file data" });
        }
        db.collection('upload.files').deleteOne({ _id: fileID }, (err) => {
            // check for error
            if (err) {
                console.log("[ error ]", err)
                return res.status(404).json({ error: "error deleting file chunks" });
            }
            FileMetadata.deleteOne({ _id: fileID }, (err) => {
                // check for error
                if (err) {
                    console.log("[ error ]", err)
                    return res.status(404).json({ error: "error deleting file chunks" });
                }
                res.json({ message: "file has been deleted." })
            });
        });
    })
});

module.exports = router;
