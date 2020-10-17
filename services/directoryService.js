const mongoose = require('mongoose');
const Directory = require('../models/Directory');
const FileMetadata = require('../models/FileMetadata');

const changeDisplayIDsToFile = async (dir_displays, base_url) => {
    return new Promise(async (resolve, reject) => {
        const file_arr = [];
        for (let i = 0; i < dir_displays.length; i++) {
            const file_id = dir_displays[i];
            const file_obj = await new Promise((resolve, reject) => {
                FileMetadata.findById(file_id).lean().exec((err, obj) => {
                    if (err || obj == null || obj.length == 0) {
                        console.log(` [error] ${err}`);
                        const errMessage = process.env.NODE_ENV == "development" ?
                            err : "retireving file failed";
                        reject(errMessage);
                    }
                    obj["url"] = `${base_url}/${obj._id}/${obj.filename.replace(/\s+/g, "%20")}`;
                    resolve(obj);
                });
            });
            file_arr.push(file_obj);
        }
        resolve(file_arr);
    });
}
const fetchDirectories = async (directory_id, base_url) => {
    return new Promise((resolve, reject) => {
        Directory.findById(directory_id).lean().exec(async (err, directory) => {
            if (err || directory == null || directory.length == 0) {
                console.log(` [error] ${err}`);
                const errMessage = process.env.NODE_ENV == "development" ?
                    err : "retireving skill failed";
                return reject(errMessage);
            }
            if ((directory.displays ? directory.displays.length : 0) > 0) {
                directory.displays = await changeDisplayIDsToFile(directory.displays, base_url);
            }
            const sectionLength = directory.sections ? directory.sections.length : 0;
            if (sectionLength > 0) {
                const savedSections = [];
                for (let i = 0; i < sectionLength; i++) {
                    const section = await fetchDirectories(directory.sections[i], base_url);
                    savedSections.push(section);
                }
                directory.sections = savedSections;
            }
            resolve(directory);
        });
    });
}
const createDirectories = async (directory) => {
    delete directory["_id"];
    const sectionLength = directory.sections.length;
    if (sectionLength > 0) {
        const savedSections = [];
        for (let i = 0; i < sectionLength; i++) {
            const section = await createDirectories(directory.sections[i]);
            savedSections.push(section._id);
        }
        directory.sections = savedSections;
    }
    return new Promise((resolve, reject) => {
        new Directory(directory).save((err, obj) => {
            if (err) {
                console.log(` [error] ${err}`);
                const errMessage = process.env.NODE_ENV == "development" ?
                    err : "saving directory failed";
                reject(errMessage);
            } else {
                console.log("\nSaved Dir", obj, "\n");
                resolve(obj);
            }
        });
    });
}
const updateDirectories = async (directory) => {
    const sectionLength = directory.sections.length;
    if (sectionLength > 0) {
        const sectionsID = [];
        for (let i = 0; i < sectionLength; i++) {
            const id = await updateDirectories(directory.sections[i]);
            sectionsID.push(id.toString());
        }
        directory.sections = sectionsID;
    }
    return new Promise((resolve, reject) => {
        try {
            let objID = mongoose.Types.ObjectId(directory._id);
            Directory.findByIdAndUpdate(objID, directory, (err, obj) => {
                if (err) {
                    console.log(` [error] ${err}`);
                    const errMessage = process.env.NODE_ENV == "development" ?
                        err : "saving directory failed";
                    reject(errMessage);
                } else {
                    console.log("\nSaved Dir", obj, "\n");
                    resolve(obj._id);
                }
            })
        } catch (err) {
            console.log(` [cast error] ${err}`);
            delete directory["_id"];
            new Directory(directory).save((err, obj) => {
                if (err) {
                    console.log(` [error] ${err}`);
                    const errMessage = process.env.NODE_ENV == "development" ?
                        err : "saving directory failed";
                    reject(errMessage);
                } else {
                    console.log("\nSaved Dir", obj, "\n");
                    resolve(obj._id);
                }
            });
        }
    });
}
const getDirectoriesID = dir_obj => {
    let directoriesID = [dir_obj._id.toString()];
    const sectionLength = dir_obj.sections.length;
    if (sectionLength > 0) {
        for (let i = 0; i < sectionLength; i++) {
            directoriesID = directoriesID.concat(getDirectoriesID(dir_obj.sections[i]));
        }
    }
    return directoriesID;
}
const DeleteDirectoriesByID = async dir_id => {
    return new Promise(async (resolve, reject) => {
        const dir_obj = await fetchDirectories(dir_id, "");
        await DeleteDirectories(getDirectoriesID(dir_obj));
        resolve(true);
    });
}
const DeleteDirectories = async arr_ids => {
    return new Promise((resolve, reject) => {
        arr_ids.forEach(id => {
            Directory.findByIdAndDelete(id, (err, obj) => {
                if (err) {
                    console.log(` [error] ${err}`);
                    reject(err)
                };
            });
        });
        resolve(true);
    });
}
const filterAndDeleteDirectories = async dir_obj => {
    const new_ids = getDirectoriesID(dir_obj);
    const old_ids = getDirectoriesID(await fetchDirectories(dir_obj._id, ""));
    const filtered_ids = old_ids.filter((ids) => {
        return !new_ids.includes(ids);
    });
    DeleteDirectories(filtered_ids);
}

module.exports = {
    fetchDirectories,
    createDirectories,
    updateDirectories,
    DeleteDirectoriesByID,
    filterAndDeleteDirectories,
    changeDisplayIDsToFile
};
