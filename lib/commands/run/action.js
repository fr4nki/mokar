const path = require('path');
const fs = require('fs');
const http = require('http');

const { log, logTypes } = require('../../utils/logs');
const { getIP, checkPermissionToRead, fileIsHidden } = require('../../utils/system');
const { mapFileNametoMimeType, getMethodFromString, getFilterFromString } = require('../../utils/templates');


const parseFile = (path, prefix, config) => {
    const LONGEST_LEN_METHOD_NAME_WITH_BRACKETS = 8;

    const rawFilename = path.toString().split('/').slice(-1)[0];

    if (fileIsHidden(rawFilename)) {
        return null
    }

    const { mime, filename: fileNameWithoutExtension, extension: mimeExtension } = mapFileNametoMimeType(rawFilename);
    const { method, filename: filenameWithoutMethod } = getMethodFromString(fileNameWithoutExtension);

    const extension = config.saveExtension && mimeExtension ? `.${mimeExtension}` : '';
    const urlPath = prefix + '/' + filenameWithoutMethod + extension;
    const matcher = getFilterFromString(urlPath);

    log(
        logTypes.msg,
        [
            (`[${method}]`).padEnd(LONGEST_LEN_METHOD_NAME_WITH_BRACKETS).toUpperCase(),
            `${urlPath} -> ${path}`,
        ],
    );

    return {
        path,
        urlPath,
        matcher,
        method,
        mime,
    };
};


const readTree = (dir, prefix, mocktree, config) => {
    const tree = mocktree;

    if (!checkPermissionToRead(dir)) {
        log(logTypes.err, `Mokar don't have permission to read '${dir}'. Skipping this one`);
        return tree;
    }

    const currentPath = fs.lstatSync(dir);
    const pathIsDirectory = currentPath.isDirectory();

    if (pathIsDirectory) {
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const absFilePath = path.resolve(dir + '/' + file);
            const fileStat = fs.lstatSync(absFilePath);
            const fileIsDirectory = fileStat.isDirectory();

            if (checkPermissionToRead(absFilePath)) {
                if (fileIsDirectory) {
                    readTree(absFilePath, prefix + '/' + file, tree, config);
                } else {
                    const file = parseFile(absFilePath, prefix, config);
                    file && tree.push(file);
                }
            }
        })
    } else {
        const file = parseFile(dir, prefix, config);
        file && tree.push(file);
    }

    return tree;
};


const makeTree = (config) => {
    log(logTypes.msg, 'Registering endpoints:');

    return config.mocks.map(({ from, prefix }) => {
        const mockPath = path.resolve(from);

        if (!mockPath) {
            log(logTypes.err, `Passed path '${from}' is wrong`);
            return [];
        }

        const mockPathExists = fs.existsSync(mockPath);

        if (!mockPathExists) {
            log(logTypes.err, `Passed path '${from}' is not exists.`);
            return [];
        }

        return readTree(mockPath, prefix, [], config);
    });
};


const action = (config) => () => {
    const ips = getIP();
    const tree = makeTree(config).flat();

    http
        .createServer({}, (req, res) => {
            const { url, method } = req;

            setTimeout(() => {
                const founded = tree.filter((item) => (
                    (
                        item.method === method.toLowerCase() ||
                        item.method === 'all'
                    ) && url.match(new RegExp(item.matcher, 'g'))
                ));

                if (founded.length > 1) {
                    log(
                        logTypes.err,
                        'There is conflicts between endpoints. Responsing with first one:\n' +
                        founded.map((item) => console.log(`- ${JSON.stringify(item)}`)),
                    );
                }

                const current = founded[0];

                if (!current) {
                    res.writeHead(404);
                    res.end('Not found');
                }

                const stream = fs.createReadStream(current.path);

                stream.on('open', () => {
                    res.setHeader('Content-type', current.mime);
                    res.statusCode = 200;
                    stream.pipe(res);
                });

                stream.on('error', () => {
                    res.setHeader('Content-type', 'text/plain');
                    res.statusCode = 404;
                    res.end('Not found');
                });

                stream.on('close', () => {
                    res.end();
                });
            }, config.delay)
        })
        .listen(config.port);

    // TODO: Make sure it works correctly on multiple interfaces
    log(logTypes.msg, `\nListen and serve. Just curl your localhost or IP ${ips.join(', ')} on port ${config.port}.`);
};

module.exports = action;
