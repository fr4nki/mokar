const logTypes = {
    'wrn': 'Warning',
    'err': 'Error',
    'msg': '',
}

const log = (logType = logTypes.msg, text) => {
    console.log(logType, text)
}

module.exports = {
    log,
    logTypes,
}
