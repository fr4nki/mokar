const logTypes = {
    'wrn': 'Warning',
    'err': 'Error',
    'msg': '',
};

// TODO: Refactoring needed
const log = (logType = logTypes.msg, text) => {
    const normalizedText = Array.isArray(text)
        ? text.join('')
        : text;

    console.log(logType, normalizedText);
};

const logList = (array) => {
    array.map(item => console.log(`  ${item}`))
};

const addSpacer = (spacer, times) => Array(times).fill(spacer).join('');

module.exports = {
    log,
    logList,
    logTypes,
    addSpacer,
};
