const logTypes = {
    'wrn': 'Warning',
    'err': 'Error',
    'msg': '',
}

// TODO: Refactoring needed
const log = (logType = logTypes.msg, text) => {
    console.log(logType, text)
}

const logList = (array) => {
    array.map(item => console.log(`  ${item}`))
}

module.exports = {
    log,
    logList,
    logTypes,
}
