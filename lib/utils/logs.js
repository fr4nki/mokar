const logTypes = {
    'wrn': 'Warning',
    'err': 'Error',
    'msg': '',
};

// TODO: Refactoring needed
const log = (text, logType = logTypes.msg) => {
    const normalizedText = Array.isArray(text)
        ? text.join('')
        : text;

    console.log(logType, normalizedText);
};

const logList = (array) => {
    array.map(item => log(logSpacer(' ', 2) + item));
};

const logSpacer = (spacer, times) => Array(times).fill(spacer).join('');

module.exports = {
    log,
    logList,
    logTypes,
    logSpacer,
};
