const { log, logTypes } = require('../utils/logs');

const checkParams = (paramsArray) => {
    if (paramsArray.length === 1 && (paramsArray.includes('-h') || paramsArray.includes('--help'))) {
        return true;
    }

    if (paramsArray.length) {
        log(logTypes.wrn, `'Help' action does not support passed params: ${paramsArray.join(', ')}.`);
        return false;
    }

    return true;
};

const action = () => {
    console.log('');
    console.log(`  Mokar is a simple mock server. More information #here#.`);
    console.log('');
    console.log(`  Usage: mokar <action> [arguments]`);
    console.log('');
    console.log(`  Actions:`);
    console.log(`    help \t Show help information`);
    console.log(`    run \t Run mokar with [arguments]`);
    console.log('');
    console.log(`  Each action except 'help' supports argument --help or -h for more detailed information.`);
    console.log('');
};

module.exports = {
    action,
    checkParams,
};
