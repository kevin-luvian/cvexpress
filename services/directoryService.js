const Directory = require('../models/Directory');

module.exports = {
    sortDir: (dir1, dir2) => {
        if (dir1.order < dir2.order) {
            return -1;
        }
        if (dir1.order > dir2.order) {
            return 1;
        }
        return (dir1.title > dir2.title) ? 1 : -1;
    },
    search: (key, array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === key) {
                return array[i];
            }
        }
    },
    processDirectories: (directories, all_directories) => {
        directories.sort(this.sortDir);
        directories.forEach(directory => {
            if (directory.sections.length > 0) {
                const sections_arr = []
                for (let i = 0; i < directory.sections.length; i++) {
                    sections_arr.push(this.search(directory.sections[i]._id, all_directories));
                }
                directory.sections = this.processDirectories(sections_arr);
            }
        });
        return directories;
    },
    deleteDirectories: (directory, all_directories) => {
        let deleted_list = [{ id: directory._id, title: directory.title }]
        if (directory.sections.length > 0) {
            const sections_arr = []
            for (let i = 0; i < directory.sections.length; i++) {
                sections_arr.push(this.search(directory.sections[i]._id, all_directories));
            }
            deleted_list.concat(this.deleteDirectories(sections_arr));
        }
        Directory.deleteOne({ _id: directory._id }, (err) => {
            if (err) {
                const errMessage = process.env.NODE_ENV == "development" ?
                    err : "error deleting a directory";
                return res.status(400).json({ error: errMessage });
            }
            return deleted_list;
        });
    }
};
