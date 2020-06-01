const os = require('os');
const fs = require('fs');
const ifaces = os.networkInterfaces();

const getIP = () => {
    const ips = [];

    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address)
            }
        });
    });

    return ips;
};

const checkPermissionToRead = (absPath) => {
    try {
        fs.accessSync(absPath, fs.constants.R_OK);
        return true;
    } catch(error) {
        return false;
    }
};

module.exports = {
    getIP,
    checkPermissionToRead,
};
