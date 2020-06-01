const { logList } = require('../../utils/logs');

const action = () => () => {
    logList([
        '',
        'Mokar is a simple mock server. More information #here#.',
        '',
        '  Usage: mokar <action> [arguments]',
        '',
        '  Actions:',
        '  run \t Run mokar with [arguments]',
        '',
        'Each action except "help" supports argument --help or -h for detailed information.',
        '',
    ])
};

module.exports = action;
