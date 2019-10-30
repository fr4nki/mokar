const defaultParams = [
    {
        // Delay
        key: ['-d', '--delay'],
        scheme: '2000',
        type: 'delay',
        description: '\t\t Delay between request and response in milliseconds.',
    },
    {
        // Port
        key: ['-p', '--port'],
        scheme: '1234',
        type: 'port',
        description: '\t\t Default server port.',
    },
    {
        key: ['-w', '--watch'],
        scheme: '',
        type: 'watch',
        description: '\t\t Watch to passed directories. Rerun server if something changes.'
    },
    {
        // Mock paths
        key: ['-m', '--mocks'],
        scheme: './s:s,./f:f',
        type: 'mocks',
        description: '\t\t Mock paths. You can pass any count of mock folders. Scheme is `--mocks=<localPath:urlPrefix>,...`. It means, your mock endpoint will be served at //localhost:[--port]/[urlPrefix]',
    }
]

const helpParams = ['-h', '--help'];

const checkParams = (paramsArray) => {
    if (!paramsArray.length) {
        return true
    }

    if (paramsArray.includes(helpParams[0]) || paramsArray.includes(helpParams[1])) {
        console.log('');
        console.log(`  Start mokar as mock server.`);
        console.log('');
        console.log(`  Usage: mokar run [arguments]`);
        console.log('');
        console.log(`  Available arguments:`);
        defaultParams.forEach((paramType) => {
            console.log('    ' + paramType.key.join(', ') + paramType.description)
        });
        console.log('');
        console.log('  Example: mokar run --watch --port=9999 --delay=2000 --mocks=./foo:/api/v1/foo,./bar:/api/v1/bar,./baz:/api/v1/baz');
        console.log('');
        console.log('  Also you can create \'.mokarrc\' file in project root or partition in your \'package.json\' file.');
        console.log('');
    }

    paramsArray.forEach((param) => {

    })
};

const action = () => {
    console.log('action run!')
};

module.exports = {
    checkParams,
    action,
};
