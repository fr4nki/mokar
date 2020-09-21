const fs = require('fs');

const fileIsHidden = filename => (/(^|\/)\.[^\/.]/g).test(filename);

const checkPermissionToRead = (absPath, flags = fs.constants.R_OK) => {
    try {
        fs.accessSync(absPath, flags);
        return true;
    } catch(error) {
        return false;
    }
};

module.exports = {
    fileIsHidden,
    checkPermissionToRead,
};
