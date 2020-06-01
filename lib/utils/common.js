const mergeObjectsDeep = (target, source) => {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object) {
            Object.assign(
                source[key],
                mergeObjectsDeep(target[key], source[key]),
            )
        }
    }

    Object.assign(target || {}, source)
    return target
};

const sortComparatorASC = (a, b) => {
    if (a.endpoint < b.endpoint) return -1;
    if (a.endpoint > b.endpoint) return 1;
    return 0;
};

const normalizeRelativePath = (path) => {
    let normalized = path;

    if (
        !normalized.startsWith('/') &&
        !normalized.startsWith('./')
    ) {
        normalized = './' + normalized;
    }

    return normalized
};

const normalizePrefixURL = (url) => {
    let normalized = url;

    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }

    return normalized;
};

const normalizeMockPaths = (type, string) => {
    if (type !== 'mocks') {
        return string
    }

    return string.split(',')
        .map(chunk => {
            let [ from, prefix = '/' ] = chunk.split(':');

            return {
                from: normalizeRelativePath(from),
                prefix: normalizePrefixURL(prefix),
            }
        });
};

module.exports = {
    mergeObjectsDeep,
    normalizeMockPaths,
    normalizePrefixURL,
    normalizeRelativePath,
    sortComparatorASC,
};
