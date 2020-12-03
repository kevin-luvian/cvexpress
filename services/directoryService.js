const mongoose = require('mongoose');
const Directory = require('../models/Directory');
const FileMetadata = require('../models/FileMetadata');

const changeDisplayIDsToFile = async (dir_displays, base_url) => {
    return new Promise(async (resolve, reject) => {
        const file_arr = [];
        for (let i = 0; i < dir_displays.length; i++) {
            const file_id = dir_displays[i];
            await getFileLeanById(file_id)
                .then(file_obj => {
                    file_obj["url"] = `${base_url}/${file_id}/${file_obj.filename.replace(/\s+/g, "%20")}`;
                    file_arr.push(file_obj);
                })
                .catch(err => {
                    console.log(` [error fetching file] ${err}`);
                });
        }
        resolve(file_arr);
    });
}
const getFileLeanById = file_id => {
    return new Promise((resolve, reject) => {
        FileMetadata.findById(file_id).lean()
            .then(file => resolve(file))
            .catch(err => reject(err))
    });
}
const fetchDirectories = async (directory_id, base_url) => {
    return new Promise(async (resolve, reject) => {
        const directory = await getDirectoryLeanById(directory_id);
        if (directory == null) return reject(null)
        if (!isEmpty(base_url)
            && directory.displays != null
            && directory.displays.length > 0) {
            await changeDisplayIDsToFile(directory.displays, base_url)
                .then(file_arr => directory.displays = file_arr);
        }
        const sectionLength = directory.sections ? directory.sections.length : 0;
        if (sectionLength > 0) {
            const savedSections = [];
            for (let i = 0; i < sectionLength; i++) {
                await fetchDirectories(directory.sections[i], base_url)
                    .then(section => savedSections.push(section))
                    .catch(err => console.log(` [error fetching section] ${err}`));
            }
            directory.sections = savedSections;
        }
        resolve(directory);
    });
}
const getDirectoryLeanById = async (directory_id) => {
    return new Promise(async (resolve, reject) => {
        await Directory.findById(directory_id).lean()
            .then(async directory => {
                resolve(directory)
            })
            .catch(err => {
                console.log(` [error fetching dir id${directory_id}] ${err}`);
                reject(err)
            })
    })
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
const parseDirectoryToDirectories = async (directory) => {
    let container = [directory];
    const sectionLength = directory.sections.length;
    let sectionsIDs;
    if (sectionLength > 0) {
        sectionsIDs = [];
        for (let i = 0; i < sectionLength; i++) {
            const tempArr = await parseDirectoryToDirectories(directory.sections[i]);
            container = container.concat(tempArr[1]);
            sectionsIDs.push(tempArr[0]._id);
        }
        directory.sections = sectionsIDs;
    }
    let thisID = ""
    try {
        thisID = mongoose.Types.ObjectId(directory._id);
    } catch (err) {
        thisID = await saveDirectory(directory)
    }
    directory._id = thisID;
    return [directory, container];
}
const saveDirectory = async (dir_obj) => {
    return new Promise((resolve, reject) => {
        delete dir_obj["_id"];
        new Directory(dir_obj).save((err, obj) => {
            if (err) {
                console.log(` [error] saving`);
                console.log(` [error parse dir ${obj}] ${err}`);
                reject(err);
            } else {
                // console.log("\nSaved Dir", obj, "\n");
                resolve(obj._id);
            }
        });
    })
}
const updateDirectories = directories => {
    directories.forEach(dir => {
        Directory.findByIdAndUpdate(dir._id, dir, (err, doc) => {
            if (err) console.log(` [error updating dir ${dir._id}] ${err}`);
        })
    })
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
        const ids_arr = getDirectoriesID(await fetchDirectories(dir_id, ""));
        await DeleteDirectories(dir_obj);
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
const isEmpty = (str) => {
    return (!str || 0 === str.length);
}

module.exports = {
    fetchDirectories,
    createDirectories,
    updateDirectories,
    DeleteDirectoriesByID,
    filterAndDeleteDirectories,
    changeDisplayIDsToFile,
    parseDirectoryToDirectories
};
