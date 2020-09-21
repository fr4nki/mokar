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

const addMissingPrefix = (shouldStartWith, exceptArray, string) => {
    let normalized = string;
    let found = false;

    exceptArray.forEach((item) => {
        if (!found && normalized.startsWith(item)) {
            found = true;
        }
    });

    if (!found) {
        normalized = shouldStartWith + normalized;
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
                from: addMissingPrefix('./', ['./', '/'], from),
                prefix: addMissingPrefix('/', ['/'], prefix),
            }
        });
};

const escapePathForRegexp = (path) => {
    const shouldBeEscaped = ['\\', '\/', '*', '+', '?', '|', '{', '[', '(',')' ,'^', '$', '.', '#'];
    const pathArray = path.split('');

    return pathArray.map((char) => {
        return shouldBeEscaped.includes(char)
            ? '\\' + char
            : char
    }).join('');
};

const flatArray = (array) => {
    if (
        !Array.isArray(array) ||
        (
            Array.isArray(array) &&
            !array.length
        )
    ) {
        return [];
    }

    const flattenedArray = [];

    (function flatten(array) {
        array.forEach(function(el) {
            if (Array.isArray(el)) {
                flatten(el)
            } else {
                flattenedArray.push(el);
            }
        });
    })(array);

    return flattenedArray;
};

module.exports = {
    flatArray,
    mergeObjectsDeep,
    addMissingPrefix,
    normalizeMockPaths,
    escapePathForRegexp,
};
