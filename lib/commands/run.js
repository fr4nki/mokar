const { log, logTypes } = require('../utils/logs');

const defaultParams = [
    {
        // Delay
        key: ['-d', '--delay'],
        scheme: '^(-d|--delay)=[0-9]*$',
        replacer: (str) => parseInt(str.replace(/^(-d|--delay)=/, ''), 10),
        type: 'delay',
        description: '\t\t Delay between request and response in milliseconds.',
    },
    {
        // Port
        key: ['-p', '--port'],
        scheme: '^(-p|--port)=[0-9]*$',
        replacer: (str) => parseInt(str.replace(/^(-p|--port)=/, ''), 10),
        type: 'port',
        description: '\t\t Default server port.',
    },
    {
        // Mock paths
        key: ['-m', '--mocks'],
        scheme: '^(-m|--mocks)=([\\w\\/?]*:[\\w\\/?]*,?)*$',
        replacer: (str) => {
            const normalStr = str.replace(/^(-m|--mocks)=/, '');
            const mocks = {};
            // TODO: Move to utils
            const replacer = s => s.replace(/^\/?([^\/]+(?:\/[^\/]+)*)\/?$/, '/$1') || '/';

            normalStr.split(',').forEach((chunk) => {
                const chunkArr = chunk.split(':');

                mocks[`.${replacer(chunkArr[0])}`] = replacer(chunkArr[1])
            });

            return mocks;
        },
        type: 'mocks',
        description: '\t\t Mock paths. You can pass any count of mock folders. Scheme is `--mocks=<localPath:urlPrefix>,...`. It means, your mock endpoint will be served at //localhost:[--port]/[urlPrefix]',
    }
]

const helpParams = ['-h', '--help'];

const checkParams = (paramsArray) => {
    const result = { check: true, settings: {} }

    if (!paramsArray.length) {
        return result;
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
        defaultParams.forEach((defaultParam) => {
            const regex = new RegExp(defaultParam.scheme)

            // TODO: FIXME: Пиши нормально!
            if (
                param.startsWith(defaultParam.key[0]) ||
                param.startsWith(defaultParam.key[1])
            ) {
                if (regex.test(param)) {
                    result.settings[defaultParam.type] = defaultParam.replacer(param);
                } else {
                    log(logTypes.wrn, `It's seems you're pass wrong param: '${param}'. Skipping this one. Check help - 'mokar run --help'`);
                }
            }
        })
    })

    return result;
};

const action = (settings) => () => {
    console.log(settings)
    console.log('action run!')
};

module.exports = {
    checkParams,
    action,
};
