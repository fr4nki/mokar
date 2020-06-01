const path = require('path');
const fs = require('fs');

const { normalizeMockPaths, normalizeRelativePath, normalizePrefixURL } = require('../../utils/common');
const { logList, log, logTypes } = require('../../utils/logs');

const defaultParams = [
    {
        key: ['-d', '--delay'],
        scheme: '^(-d|--delay)=[0-9]*$',
        replacer: (str) => parseInt(str.replace(/^(-d|--delay)=/, ''), 10),
        type: 'delay',
        default: 50,
        description: '\t\t Delay between request and response in milliseconds.',
    },
    {
        key: ['-p', '--port'],
        scheme: '^(-p|--port)=[0-9]*$',
        replacer: (str) => parseInt(str.replace(/^(-p|--port)=/, ''), 10),
        type: 'port',
        default: 9990,
        description: '\t\t Default server port.',
    },
    {
        key: ['-m', '--mocks'],
        scheme: '^(-m|--mocks)=([.?\\w\\/?]+:?[\\w\\/?]+,?)+$',
        replacer: (str) => str.replace(/^(-m|--mocks)=/, ''),
        type: 'mocks',
        default: [
            {
                from: './mocks',
                prefix: '/',
            },
        ],
        description: '\t\t Mock paths. You can pass any count of mock folders. Scheme is `--mocks=<urlPrefix:localPath>,...`. It means, your mock endpoint will be served at //localhost:[--port]/[urlPrefix]',
    },
    {
        key: ['-h', '--help'],
        description: '\t\t Read this manual again :)',
    }
];


// === Собираем CLI конфиги пользователя
const parseCliParams = (cliParams, defaultParams) => {
    const settings = {};

    defaultParams.forEach((param) => {
        if (param.type && param.default) {
            const regex = new RegExp(param.scheme);

            cliParams.forEach((cliParam) => {
                const [key] = cliParam.split('=');

                if (key === param.key[0] || key === param.key[1]) {
                    if (regex.test(cliParam)) {
                        settings[param.type] = normalizeMockPaths(param.type, param.replacer(cliParam))
                    }
                }
            });
        }
    });

    return settings
};

// === Собираем дефолтный конфиг
const getDefaultConfig = (defaultParams) => (
    defaultParams.reduce((object, item) => (
        item.default
            ? {
                ...object,
                [item.type]: item.default
            }
            : {
                ...object,
            }
    ), {})
);


// === Собираем все конфиги пользователя
const getUserConfig = (cliParams) => {
    const cliConfig = parseCliParams(cliParams, defaultParams);
    const defaultConfig = getDefaultConfig(defaultParams);
    const commonConfig = {};

    const files = [
        { name: 'package.json', key: 'mokar' },
        { name: '.laptirc', key: null }, // laptirc - what a fun
        { name: '.mokarrc', key: null },
    ];

    files.forEach((file) => {
        const { name, key } = file;
        let data = {};

        if (fs.existsSync(name)) {
            const dataString = fs.readFileSync(path.resolve(name)).toString();

            try {
                const dataJSON = JSON.parse(dataString);
                data = key ? dataJSON[key] : dataJSON;
            } catch(e) {}

            if (data.mocks && data.mocks.length) {
                data.mocks = data.mocks.map(({ from, prefix }) => {
                    return {
                        from: normalizeRelativePath(from),
                        prefix: normalizePrefixURL(prefix),
                    }
                })
            }

            commonConfig[name] = data;
        }
    });

    const userConfig = Object.assign(
    {},
        ...Object.keys(commonConfig).map((key) => commonConfig[key]),
        cliConfig,
    );

    if (!Object.keys(userConfig).length) {
        log(logTypes.msg, `Using default config. ${JSON.stringify(defaultConfig)}`);
    }

    return Object.assign(
        defaultConfig,
        userConfig,
    );
};


const settings = (paramsArray) => {
    const result = {checked: true, settings: {}};
    const helpParams = ['-h', '--help'];

    if (paramsArray.includes(helpParams[0]) || paramsArray.includes(helpParams[1])) {
        result.checked = false;

        logList([
            '',
            'Start Mokar as mock server.',
            '',
            'Usage: mokar run [arguments]',
            '',
            'Available arguments:',
            ...defaultParams.map(param => param.key.join(', ') + param.description),
            '',
            'Example: mokar run --port=9999 --delay=2000 --mocks=/api/v1/foo:./foo,/api/v1/bar:./bar,/api/v1/baz:./baz',
            '',
            'Also you can create \'.mokarrc\' file in project root or partition in your \'package.json\' file.',
            '',
        ]);

        return result;
    }

    result.settings = getUserConfig(paramsArray);

    return result;
};

module.exports = settings;
