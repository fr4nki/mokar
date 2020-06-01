const http = require('http');

const { log, logTypes } = require('../../utils/logs');
const { getIP, checkPermissionToRead } = require('../../utils/system');

const templateConfig = {
    method: ['[', ']'],
    type: ['{','}']
};

const path = require('path');
const fs = require('fs');
const { mapFileNametoMimeType, getMethodFromString, getFilterFromString } = require('../../utils/templates');
// const url = require('url');
// const http = require('http');
//
// const { get: getConfig } = require('../../config');
// const { sortComparatorASC } = require('../../utils/common');
// const { getFilterFromString, mapExtToMimeType } = require('../../utils/types');
//
// const getQuery = (endpointArray) => {
//     const endpointArrayNormalized = Object.assign([], endpointArray.reverse())
//     const queryArray = []
//     let error = false
//
//     // console.log(endpointArrayNormalized)
//
//     const endpoint = endpointArrayNormalized.map((chunk, count) => {
//         let currentChunk = chunk
//
//         const isLast = count === endpointArrayNormalized.length - 1
//         const parts = url.parse(chunk, true)
//         const { query } = parts
//         const queryKeys = Object.keys(query)
//
//         // console.log(chunk)
//
//         if (!isLast) {
//             if (queryKeys.length) {
//                 log(logTypes.err, 'Query params must not exists in the middle of endpoint', endpointArrayNormalized.join('/'))
//                 error = true
//             }
//         } else {
//             if (queryKeys.length) {
//                 queryKeys.forEach((key) => {
//                     queryArray.push([key, query[key]])
//                 })
//
//                 currentChunk = currentChunk.replace(/[?].*/, '')
//             }
//         }
//
//         return currentChunk
//     })
//
//     return {endpoint, query: queryArray, error}
// }
//
//
// const methodList = {
//     '[all]': 'all',
//     '[get]': 'get',
//     '[head]': 'head',
//     '[post]': 'post',
//     '[put]': 'put',
//     '[delete]': 'delete',
//     '[patch]': 'patch'
// }
// const methodDefault = methodList['[all]']
//
//
// const getMethod = endpointArray => {
//     let currentMethod = null
//
//     const endpointReversed = endpointArray.reverse().map((chunk) => {
//         let currentChunk = chunk
//
//         Object.keys(methodList).forEach((methodKey) => {
//             if (chunk.toLowerCase().includes(methodKey)) {
//                 if (!currentMethod) {
//                     currentMethod = methodList[methodKey]
//                 }
//
//                 currentChunk = currentChunk.replace(methodKey.toUpperCase(), '')
//             }
//         })
//
//         return currentChunk
//     })
//
//     if (!currentMethod) {
//         currentMethod = methodDefault
//     }
//
//     return { method: currentMethod, endpoint: endpointReversed }
// }
//
//
//
// const getFilters = (endpointArray) => {
//     const tplBrackets = {
//         start: '{',
//         end: '}',
//     }
//     const delimeter = '|'
//     const rangeSeparator = '-'
//     const endpointRangeSeparator = ','
//
//     let error = false
//
//     const endpoint = endpointArray.map((chunk) => {
//         if (chunk.startsWith(tplBrackets.start) && chunk.endsWith(tplBrackets.end)) {
//             const rawChunk = chunk.replace(/[{}]/g, '')
//             const hasDelimeter = rawChunk.includes(delimeter)
//
//             let type = rawChunk
//             let limit = null
//             let limitHasRange = false
//
//             if (hasDelimeter) {
//                 const rawChunkArray = rawChunk.split(delimeter)
//                 type = rawChunkArray[0]
//                 limit = rawChunkArray[1]
//             }
//
//             if (typeof limit === 'string') {
//                 limitHasRange = String(limit).includes(rangeSeparator)
//
//                 if (limitHasRange) {
//                     const limitArray = String(limit).split(rangeSeparator).map(n => parseInt(n, 10))
//
//                     if (isNaN(limitArray[0]) || isNaN(limitArray[1])) {
//                         error = true
//                         log('Wrong limit, check it', endpoint.join('/'))
//                     }
//
//                 }
//
//                 limit = '{' + String(limit).replace(rangeSeparator, endpointRangeSeparator) + '}'
//             }
//
//             if (!getFilterFromString(type)) {
//                 error = true;
//                 log('Its seems youre passed wrong filter. Check mans')
//             }
//
//             return `(${getFilterFromString(type)}${limit})`
//         }
//
//         return chunk
//     })
//
//     return { endpoint, error }
// }
//
// const getNormalizedEndpoint = (endpointArray) => {
//     const separator = '/'
//     const endpoint = separator + endpointArray.join(separator)
//     return { endpoint }
// }
//
//
//
//
// const getTree = function(dir, prefix, startDir = '') {
//     let results = [];
//     const list = fs.readdirSync(dir);
//
//     list.forEach(function(filename) {
//         const file = dir + '/' + filename;
//         const stat = fs.statSync(file);
//
//         if (stat && stat.isDirectory()) {
//             results = results.concat(getTree(file, prefix, startDir + '/' + filename));
//         } else {
//             const ext = path.extname(file)
//             const fileWOExt = filename.replace(ext, '')
//
//             // TODO: Must be tested at Windows and Linux.
//             //  Add check for Win32 if necessary.
//             const cleanFilename = fileWOExt.replace(/:/g, '/')
//             const endpointRaw = (prefix + startDir + '/' + cleanFilename).split('/').filter(txt => txt.trim() !== '')
//
//             const contentType = mapExtToMimeType(ext)
//
//             const { endpoint: endpointMethod, method } = getMethod(endpointRaw)
//             const { endpoint: endpointQuery, query, error: queryError } = getQuery(endpointMethod)
//             const { endpoint: endpointFitered, filterError } = getFilters(endpointQuery)
//             const { endpoint } = getNormalizedEndpoint(endpointFitered)
//
//             results.push({
//                 error: [filterError, queryError],
//                 contentType,
//                 query,
//                 endpoint,
//                 file,
//                 method,
//             });
//         }
//     });
//     return results;
// }
//
// const action = (cliConfig) => () => {
//     getConfig()
//         .then((config) => Object.assign({}, config, cliConfig))
//         .then((config) => (
//             {
//                 config,
//                 structure: (
//                     config.mocks
//                         .map(item => getTree(
//                             path.resolve() + '/' + item.from,
//                             item.prefix,
//                         ))
//                         .map(item => item.sort(sortComparatorASC))
//                 ),
//             }
//         ))
//         .then(({ config, structure }) => {
//             http.createServer((request, response) => {
//                 setTimeout(() => {
//                     structure.forEach((block) => {
//                         block.forEach((endpoint) => {
//                             // console.log(endpoint)
//
//                         })
//                     })
//
//                     // console.log(request.method)
//
//                     response.setHeader('Content-Type', 'application/json')
//                     response.write('{}')
//                     response.end()
//                 }, config.timeout)
//             }).listen(config.port, () => {
//                 log(logTypes.msg, `Mokar starts at :${config.port} and ready to serve.`)
//             })
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// };
//
// module.exports = action;


const parseFile = (absPath, prefix) => {
    console.log('absPath', absPath);
    console.log('prefix', prefix);

    const rawFilename = absPath.split('/').slice(-1)[0];
    const mime = mapFileNametoMimeType(rawFilename);

    const { method, filename: filenameWithoutMethod } = getMethodFromString(rawFilename);
    const filenameWithoutFilter = getFilterFromString(filenameWithoutMethod);

    console.log(method);
    console.log('file', rawFilename);
    console.log('=====');

    return {
        path: absPath,
        url: prefix + '/' + filenameWithoutFilter,
        method,
        mime,
    };
};


const readTree = (dir, prefix, mocktree) => {
    const tree = mocktree;

    if (!checkPermissionToRead(dir)) {
        log(logTypes.err, `Mokar don't have permission to read '${dir}'. Skipping this one`);
        return tree;
    }

    const pathIsDirectory = fs.statSync(dir).isDirectory();

    if (pathIsDirectory) {
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const absFilePath = path.resolve(dir + '/' + file);
            const fileIsDirectory = fs.statSync(absFilePath).isDirectory();

            if (checkPermissionToRead(absFilePath)) {
                if (fileIsDirectory) {
                    readTree(absFilePath, prefix + '/' + file, tree);
                } else {
                    tree.push(parseFile(absFilePath, prefix));
                }
            }
        })
    } else {
        tree.push(parseFile(dir, prefix))
    }

    return tree;
};

const makeTree = (mocksList) => {
    const tree = mocksList.map(({ from, prefix }) => {
        let mockArray = [];
        const mockPath = path.resolve(from);

        if (!mockPath) {
            log(logTypes.err, `Passed path '${from}' is wrong`);
            return mockArray;
        }

        const mockPathExists = fs.existsSync(mockPath);

        if (!mockPathExists) {
            log(logTypes.err, `Passed path '${from}' is not exists.`);
            return mockArray;
        }

        const t = readTree(mockPath, prefix, []);

        console.log('---------------')
        console.log(t)
        console.log('---------------')

        return mockArray;

    });
};

const action = (config) => () => {
    const ips = getIP();
    const tree = makeTree(config.mocks);

    http
        .createServer({}, (req, res) => {
            console.log(req.url)
            console.log(req.method)
            setTimeout(() => {
                res.writeHead(200);
                res.end('foopka')
            }, config.delay)
        })
        .listen(config.port);

    // TODO: Make sure it works correctly on multiple interfaces
    log(logTypes.msg, `Listen and serve. Just curl your localhost or IP ${ips.join(', ')} on port ${config.port}.`);
};

module.exports = action;
