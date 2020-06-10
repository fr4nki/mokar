const { escapePathForRegexp } = require('./common');


const mapFileNametoMimeType = (filename) => {
    const [name, extension] = filename.split('.');
    const defaultMimeType = 'application/octet-stream';

    const mimeTypes = {
        'json': 'application/json',
        'png':  'image/png',
        'jpeg': 'image/jpeg',
        'jpg':  'image/jpeg',
        'gif':  'image/gif',
        'svg':  'image/svg+xml',
        'txt':  'text/plain',
        'html': 'text/html',
        'js':   'text/javascript',
        'css':  'text/css',
        'mpeg': 'audio/mpeg',
        'mp3':  'audio/mpeg',
        'wav':  'audio/wav',
        'ogg':  'audio/ogg',
        'mp4':  'video/mp4',
    };

    return {
        mime: mimeTypes[extension] || defaultMimeType,
        extension,
        filename: name,
    };
};


const getMethodFromString = (name) => {
    const result = {
        filename: name,
        method: 'all',
    };

    const methods = {
        '[all]': 'all',
        '[get]': 'get',
        '[head]': 'head',
        '[post]': 'post',
        '[put]': 'put',
        '[delete]': 'delete',
        '[patch]': 'patch',
    };

    Object.keys(methods).forEach((m) => {
        if (result.filename.toLowerCase().startsWith(m)) {
            const regexp = new RegExp(`\\[${methods[m]}\\]`, 'gi');

            result.method = methods[m];
            result.filename = result.filename.replace(regexp, '');
        }
    });

    return result;
};


const getLengthFromTemplate = (template) => {
    const [start, finish] = ['{', '}'];
    const lenSeparator = '#';

    const result = {
        type: 'any',
        len: null,
        source: template,
    };

    if (template.startsWith(start) && template.endsWith(finish)) {
        const clean = template.replace(start, '').replace(finish, '');

        if (clean.includes(lenSeparator)) {
            const [type, len] = clean.split(lenSeparator);
            const length = len.split(',');

            result.type = type;

            // It's because regexp cannot make this - {, A}, only {A, } and {A, B}
            if (length.length === 2 && !length[0]) {
                length[0] = '1';
            }

            result.len = length
        } else {
            result.type = clean;
        }
    }

    return result
};

const wrapWithDefaultRegexp = (path) => `^${path}$`;

// TODO: Clean this
// Don't try to understand what's happening below :)
const getFilterFromString = (endpoint) => {
    const presets = {
        'any': '[a-zA-Z0-9_-]',
        'number': '[0-9]',
        'string': '[a-zA-Z]',
    };

    const matcher = new RegExp(/{(any|number|string)(#\d*(,\d*)?)?}/g);
    const matchedTemplates = endpoint.match(matcher);

    if (!matchedTemplates) {
        return wrapWithDefaultRegexp(escapePathForRegexp(endpoint));
    }

    const templates = matchedTemplates.map(getLengthFromTemplate).map((tmpl) => {
        const joiner = presets[tmpl.type] + `{${tmpl.len.join(',')}}`;
        return endpoint.split(tmpl.source).map(escapePathForRegexp).join(joiner);
    }).join();

    return wrapWithDefaultRegexp(templates);
};

module.exports = {
    mapFileNametoMimeType,
    getMethodFromString,
    getFilterFromString,
};
