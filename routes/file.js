
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
        for(let i=0; i<data_list.length; i++){
        	data_list[i].fileurl = 
        	`http://${req.get('host')}` +
        	'/api/files'+
        	`/${data_list[i]._id}/`+
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
    const gfs = grid(db, mongoose.mongo);
    gfs.collection("upload")

    // find file from id
    db.collection('upload.files').findOne({ _id: fileID }, (err, data) => {
        // check for error
        if (err) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error finding file" })
        }
        if (!data || data.length === 0) return res.status(404).json({ error: "no file found" });

        const readStream = gfs.createReadStream({ filename: data.filename });
        readStream.pipe(res);
    })
});

/* GET file by ID */
router.get('/test/:id/:filename', (req, res) => {
    const fileID = mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;
    const collection = db.collection('upload.files');
    const collectionChunks = db.collection('upload.chunks');

    console.log("FILE ID :", fileID);
    // find file from id
    collection.findOne({ _id: fileID }, (err, data) => {
        // check for error
        if (err) {
            console.log("[ error ]", err)
            return res.status(404).json({ error: "error finding file" })
        }
        console.log("DATA", data)
        if (!data || data.length === 0) return res.status(404).json({ error: "no file found" });

        // read file's chunks
        collectionChunks
            .find({ files_id: fileID })
            .sort({ n: 1 })
            .toArray((err, chunks) => {
                if (err) {
                    console.log("[ error ]", err)
                    return res.status(404).json({ error: "error retrieving chunks" });
                }
                if (!chunks || chunks.length === 0) res.status(404).json({ error: "no data found" });

                let fileData = [];
                for (let i = 0; i < chunks.length; i++) {
                    //This is in Binary JSON or BSON format, which is stored               
                    //in fileData array in base64 endocoded string format               

                    fileData.push(chunks[i].data.toString('base64'));
                }
                //Display the chunks using the data URI format          
                const finalFile = `data:${data.contentType};base64,${fileData.join('')}`;

                res.contentType(data.contentType);
                res.send(finalFile);
            });
    });
});

module.exports = router;
