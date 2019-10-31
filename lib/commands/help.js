const checkParams = () => {
    return { check: true, settings: {} };
};

const action = () => () => {
    console.log('');
    console.log(`  Mokar is a simple mock server. More information #here#.`);
    console.log('');
    console.log(`  Usage: mokar <action> [arguments]`);
    console.log('');
    console.log(`  Actions:`);
    console.log(`    help \t Show help information`);
    console.log(`    run \t Run mokar with [arguments]`);
    console.log('');
    console.log(`  Each action except 'help' supports argument --help or -h for detailed information.`);
    console.log('');
};

module.exports = {
    action,
    checkParams,
};
