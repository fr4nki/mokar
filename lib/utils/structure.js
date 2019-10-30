const path = require('path')
const fs = require('fs')
const url = require('url')

const { log } = require('./logs')

const getQuery = (endpointArray) => {
    const endpointArrayNormalized = Object.assign([], endpointArray.reverse())
    const queryArray = []
    let error = false

    const endpoint = endpointArrayNormalized.map((chunk, count) => {
        let currentChunk = chunk

        const isLast = count === endpointArrayNormalized.length - 1
        const parts = url.parse(chunk, true)
        const { query } = parts
        const queryKeys = Object.keys(query)

        if (!isLast) {
            if (queryKeys.length) {
                log('Query params must not exists in the middle of endpoint', endpointArrayNormalized.join('/'))
                error = true
            }
        } else {
            if (queryKeys.length) {
                queryKeys.forEach((key) => {
                    queryArray.push([key, query[key]])
                })

                currentChunk = currentChunk.replace(/[?].*/, '')
            }
        }

        return currentChunk
    })

    return {endpoint, query: queryArray, error}
}

const mimeType = (type) => (
    {
        '.json': 'application/json',
        '.png':  'image/png',
        '.jpeg': 'image/jpeg',
        '.jpg':  'image/jpeg',
        '.gif':  'image/gif',
        '.svg':  'image/svg+xml',
        '.txt':  'text/plain',
        '.html': 'text/html',
        '.js':   'text/javascript',
        '.css':  'text/css',
        '.mpeg': 'audio/mpeg',
        '.mp3':  'audio/mpeg',
        '.wav':  'audio/wav',
        '.ogg':  'audio/ogg',
        '.mp4':  'video/mp4',
    }[type]
)

const methodList = {
    '[all]': 'all',
    '[get]': 'get',
    '[head]': 'head',
    '[post]': 'post',
    '[put]': 'put',
    '[delete]': 'delete',
    '[patch]': 'patch'
}
const methodDefault = methodList['[all]']

const getMethod = endpointArray => {
    let currentMethod = null

    const endpointReversed = endpointArray.reverse().map((chunk) => {
        let currentChunk = chunk

        Object.keys(methodList).forEach((methodKey) => {
            if (chunk.toLowerCase().includes(methodKey)) {
                if (!currentMethod) {
                    currentMethod = methodList[methodKey]
                }

                currentChunk = currentChunk.replace(methodKey.toUpperCase(), '')
            }
        })

        return currentChunk
    })

    if (!currentMethod) {
        currentMethod = methodDefault
    }

    return { method: currentMethod, endpoint: endpointReversed }
}


const filterList = (type) => (
    {
        any: '[a-zA-Z0-9_-]',
        number: '[0-9]',
        string: '[a-zA-Z]',
    }[type]
)

const getFilters = (endpointArray) => {
    const tplBrackets = {
        start: '{',
        end: '}',
    }
    const delimeter = '|'
    const rangeSeparator = '-'
    const endpointRangeSeparator = ','

    let error = false

    const endpoint = endpointArray.map((chunk) => {
        if (chunk.startsWith(tplBrackets.start) && chunk.endsWith(tplBrackets.end)) {
            const rawChunk = chunk.replace(/[{}]/g, '')
            const hasDelimeter = rawChunk.includes(delimeter)

            let type = rawChunk
            let limit = null
            let limitHasRange = false

            if (hasDelimeter) {
                const rawChunkArray = rawChunk.split(delimeter)
                type = rawChunkArray[0]
                limit = rawChunkArray[1]
            }

            if (typeof limit === 'string') {
                limitHasRange = String(limit).includes(rangeSeparator)

                if (limitHasRange) {
                    const limitArray = String(limit).split(rangeSeparator).map(n => parseInt(n, 10))

                    if (isNaN(limitArray[0]) || isNaN(limitArray[1])) {
                        error = true
                        log('Wrong limit, check it', endpoint.join('/'))
                    }

                }

                limit = '{' + String(limit).replace(rangeSeparator, endpointRangeSeparator) + '}'
            }

            if (!filterList(type)) {
                error = true
                log('Its seems youre passed wrong filter. Check mans')
            }

            return `(${filterList(type)}${limit})`
        }

        return chunk
    })

    return { endpoint, error }
}

const getNormalizedEndpoint = (endpointArray) => {
    const separator = '/'
    const endpoint = separator + endpointArray.join(separator)
    return { endpoint }
}


const getTree = function(dir, prefix, pre) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(function(filename) {
        const file = dir + '/' + filename;
        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getTree(file, prefix, pre + '/' + filename));
        } else {
            const ext = path.extname(file)
            const fileWOExt = filename.replace(ext, '')

            // TODO: Must be tested at Windows and Linux.
            //  Add check for Win32 if necessary.
            const cleanFilename = fileWOExt.replace(/:/g, '/')
            const endpointRaw = (prefix + pre + '/' + cleanFilename).split('/').filter(txt => txt.trim() !== '')

            const contentType = mimeType(ext)

            const { endpoint: endpointMethod, method } = getMethod(endpointRaw)
            const { endpoint: endpointQuery, query, error: queryError } = getQuery(endpointMethod)
            const { endpoint: endpointFitered, filterError } = getFilters(endpointQuery)
            const { endpoint } = getNormalizedEndpoint(endpointFitered)

            results.push({
                error: [filterError, queryError],
                contentType,
                query,
                endpoint,
                file,
                method,
            });
        }
    });
    return results;
}

const structure = (rootPath, from) => {
    const keys = Object.keys(from)

    const arr = keys.map((prefix) => getTree(rootPath + '/' + from[prefix], prefix, ''))

    const comparator = (a, b) => {
        if (a.endpoint < b.endpoint) return -1;
        if (a.endpoint > b.endpoint) return 1;
        return 0;
    }

    return arr.map(items => {
        return items.sort(comparator)
    })
}

module.exports = {
    structure,
}
